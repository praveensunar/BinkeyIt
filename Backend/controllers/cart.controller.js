import CartProductModel from '../Models/cartproduct.model.js'
import OrderModel from '../Models/order.model.js'
import UserModel from '../Models/user.model.js'
import mongoose from 'mongoose'
import Stripe from "../config/stripe.js";

export async function cashOnDeliveryController(request, response) {
    try {
        const userId = request.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        const payload = list_items.map(el => ({
            userId: userId,
            orderId: `ORD-${new mongoose.Types.ObjectId()}`,
            productId: el.productId._id,
            product_details: {
                name: el.productId.name,
                image: el.productId.image?.[0]
            },
            paymentId: "",
            payment_status: "CASH ON DELIVERY",
            delivery_address: addressId,
            subTotalAmt: subTotalAmt,
            totalAmt: totalAmt,
        }))

        const generatedOrder = await OrderModel.insertMany(payload)
        await CartProductModel.deleteMany({ userId: userId })
        await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        return response.json({
            message: "Order successfully",
            error: false,
            success: true,
            data: generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


export const priceWithDiscount = (price, discount = 1) => {
    const discountAmount = Math.ceil((Number(price) * Number(discount)) / 100)
    const actualPrice = Number(price) - Number(discountAmount)
    return actualPrice
}


export async function paymentController(request, response) {
    try {
        const userId = request.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        if (totalAmt < 50) {
            return response.status(400).json({
                message: "Minimum order amount for online payment is ₹50.",
                error: true,
                success: false
            })
        }

        const line_items = list_items.map(item => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.productId.name,
                    images: [item.productId.image?.[0]],  // FIX: consistent image access
                    metadata: {
                        productId: item.productId._id.toString(),
                    },
                },
                unit_amount: priceWithDiscount(item.productId.price, item.productId.discount) * 100,
            },
            adjustable_quantity: {
                enabled: true,
                minimum: 1,
            },
            quantity: item.quntity
        }))

        const user = await UserModel.findById(userId)

        const frontendUrl = process.env.FRONTEND_URL || "https://binkeyit-clone.netlify.app"

        // Embed cart into metadata so webhook can recreate the order reliably
        const cartItemsMetadata = list_items.map(item => ({
            productId: item.productId._id.toString(),
            name: item.productId.name,
            image: item.productId.image?.[0],  // FIX: consistent image access
            quantity: item.quntity,
            price: priceWithDiscount(item.productId.price, item.productId.discount)
        }))

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId.toString(),
                addressId: addressId.toString(),
                cartItems: JSON.stringify(cartItemsMetadata)
            },
            line_items: line_items,
            success_url: `${frontendUrl}/success`,
            cancel_url: `${frontendUrl}/cancel`,
        }

        const session = await Stripe.checkout.sessions.create(params)

        // FIX: Do NOT clear the cart here.
        // Cart is cleared inside the webhook after confirmed payment.
        // Clearing here means if the webhook fires before this response,
        // or if user abandons payment, cart is gone with no order created.

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}


const buildOrderItems = (cartItems, { userId, addressId, paymentId, payment_status }) => {
    return cartItems.map(item => ({
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: item.productId,
        product_details: {
            name: item.name,
            image: [item.image]
        },
        paymentId: paymentId,
        payment_status: payment_status,
        delivery_address: addressId,
        subTotalAmt: Number(item.price * item.quantity),
        totalAmt: Number(item.price * item.quantity),
    }))
}


export async function webHookPayment(request, response) {
    const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY
    const signature = request.headers['stripe-signature']

    let event

    try {
        // FIX: Verify the webhook signature using the raw body Buffer.
        // request.body MUST be a raw Buffer — see index.js for middleware setup.
        event = Stripe.webhooks.constructEvent(request.body, signature, endpointSecret)
    } catch (err) {
        // If signature fails, reject immediately — do not process
        console.error("Webhook signature verification failed:", err.message)
        return response.status(400).send(`Webhook Error: ${err.message}`)
    }

    console.log("---------------- WEBHOOK EVENT ----------------")
    console.log("Type:", event.type)

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const metadata = session.metadata

        if (!metadata?.userId) {
            console.error("No userId in metadata. Aborting.")
            return response.status(400).send("Missing userId in metadata")
        }

        // Guard: skip if payment wasn't actually collected
        if (session.payment_status !== 'paid') {
            console.warn("Session completed but payment_status is not 'paid'. Skipping.")
            return response.json({ received: true })
        }

        // Guard: prevent duplicate orders if Stripe retries the webhook
        const existingOrder = await OrderModel.findOne({ paymentId: session.payment_intent })
        if (existingOrder) {
            console.log("Order already exists for this payment_intent. Skipping duplicate.")
            return response.json({ received: true })
        }

        let cartItems = []
        try {
            cartItems = JSON.parse(metadata.cartItems)
        } catch (e) {
            console.error("Failed to parse cartItems from metadata:", e.message)
            return response.status(400).send("Invalid cartItems metadata")
        }

        if (!cartItems.length) {
            console.error("cartItems metadata is empty. Cannot create order.")
            return response.status(400).send("Empty cart metadata")
        }

        const orderPayload = buildOrderItems(cartItems, {
            userId: metadata.userId,
            addressId: metadata.addressId,
            paymentId: session.payment_intent,
            payment_status: session.payment_status,
        })

        const order = await OrderModel.insertMany(orderPayload)
        console.log(`SUCCESS: ${order.length} order(s) stored for user ${metadata.userId}`)

        // Clear cart only after order is confirmed saved
        await CartProductModel.deleteMany({ userId: metadata.userId })
        await UserModel.findByIdAndUpdate(metadata.userId, { shopping_cart: [] })
        console.log("Cart cleared after confirmed payment.")
    }

    console.log("---------------- WEBHOOK END ----------------")
    return response.json({ received: true })
}


export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId

        const orderlist = await OrderModel.find({ userId: userId })
            .sort({ createdAt: -1 })
            .populate('delivery_address')

        return response.json({
            message: "order list",
            error: false,
            success: true,
            data: orderlist
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}