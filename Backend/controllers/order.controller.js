import CartProductModel from '../Models/cartproduct.model.js'
import OrderModel from '../Models/order.model.js'
import UserModel from '../Models/user.model.js'
import mongoose from 'mongoose'
import Stripe from "../config/stripe.js";

export async function cashOnDeliveryController(request, response) {

    try {
        const userId = request.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        const payload = list_items.map(el => {
            return ({
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
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)
        const removeCartItems = await CartProductModel.deleteMany({ userId: userId })
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

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
    return actualPrice;
}


export async function paymentController(request, response) {
    try {
        const userId = request.userId
        const { list_items, totalAmt, addressId, subTotalAmt } = request.body

        // Stripe minimum amount check (around 50 cents)
        // For INR, 50 cents is approx ₹45. We enforce ₹50 for safety.
        if (totalAmt < 50) {
            return response.status(400).json({
                message: "Minimum order amount for online payment is ₹50. Please add more items or choose Cash on Delivery.",
                error: true,
                success: false
            })
        }

        const line_items = list_items.map(item => {
            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.productId.name,
                        images: [Object.values(item.productId.image)[0]],
                        metadata: {
                            productId: item.productId._id.toString(), // Ensure string
                        },
                    },
                    unit_amount: priceWithDiscount(item.productId.price, item.productId.discount) * 100,

                },
                adjustable_quantity: {
                    enabled: true,
                    minimum: 1,
                },
                quantity: item.quntity

            }
        })


        const user = await UserModel.findById(userId)

        const frontendUrl = (process.env.FRONTEND_URL === "http://localhost:5173" || !process.env.FRONTEND_URL)
            ? "https://binkeyit-clone.netlify.app"
            : process.env.FRONTEND_URL;

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId.toString(), // Ensure string
                addressId: addressId.toString() // Ensure string
            },
            line_items: line_items,
            success_url: `${frontendUrl}/success`,
            cancel_url: `${frontendUrl}/cancel`,
        }

        const session = await Stripe.checkout.sessions.create(params)

        const removeCartItems = await CartProductModel.deleteMany({ userId: userId })
        const updateInUser = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        return response.status(200).json(session)
    } catch (error) {

        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

const getOrderProductItems = async (
    {
        lineItems,
        userId,
        addressId,
        paymentId,
        payment_status,
    }) => {
    const productList = []

    try {
        if (lineItems?.data?.length) {
            for (const item of lineItems.data) {
                const product = await Stripe.products.retrieve(item.price.product)

                // Get productId from stripe product metadata
                const productId = product.metadata.productId;

                if (!productId) {
                    console.error("Missing productId in Stripe product metadata for product:", product.id);
                }

                const payload = {
                    userId: userId,
                    orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                    productId: productId,
                    product_details: {
                        name: product.name,
                        image: product.images
                    },
                    paymentId: paymentId,
                    payment_status: payment_status,
                    delivery_address: addressId,
                    subTotalAmt: Number(item.amount_total / 100),
                    totalAmt: Number(item.amount_total / 100),
                }

                productList.push(payload)
            }
        }
    } catch (error) {
        console.error("Error in getOrderProductItems:", error);
        throw error; // Re-throw to be caught in webHookPayment
    }

    return productList
}
// http://localhost:8080/
export async function webHookPayment(request, response) {
    try {
        const event = request.body
        const endpointSecret = process.env.STRIPE_ENDPOINT_WEBHOOK_SECRET_KEY

        console.log("---------------- WEBHOOK EVENT RECEIVED ----------------")
        console.log("Event Type:", event.type)

        switch (event.type) {
            case 'checkout.session.completed':
                const session = event.data.object;

                console.log("Session ID:", session.id)
                console.log("Metadata in Session:", JSON.stringify(session.metadata, null, 2))

                const userId = session.metadata?.userId
                const addressId = session.metadata?.addressId

                if (!userId) {
                    console.error("DIAGNOSTIC ERROR: No userId found in session.metadata. Cannot proceed with order creation.");
                    return response.status(400).send("User ID missing in metadata");
                }

                console.log("Retrieving line items for session...")
                const lineItems = await Stripe.checkout.sessions.listLineItems(session.id)
                console.log(`Retrieved ${lineItems.data.length} line items.`)

                const orderProduct = await getOrderProductItems(
                    {
                        lineItems: lineItems,
                        userId: userId,
                        addressId: addressId,
                        paymentId: session.payment_intent,
                        payment_status: session.payment_status,
                    })

                console.log(`Prepared ${orderProduct.length} products for OrderModel.insertMany`)

                if (orderProduct.length > 0) {
                    try {
                        const order = await OrderModel.insertMany(orderProduct)
                        console.log(`SUCCESS: Created ${order.length} order records in MongoDB.`)

                        // Clear cart ONLY on success
                        console.log("Initiating cart cleanup for user:", userId)
                        await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] })
                        const deleteResult = await CartProductModel.deleteMany({ userId: userId })
                        console.log(`Cart products cleared. Deleted count: ${deleteResult.deletedCount}`)
                    } catch (dbError) {
                        console.error("MONGODB INSERTION ERROR:", dbError.message)
                        console.error("Payload that failed:", JSON.stringify(orderProduct, null, 2))
                        return response.status(500).json({
                            message: "Database insertion failed",
                            error: dbError.message,
                            success: false
                        })
                    }
                } else {
                    console.warn("WARNING: No valid products found to save. Check getOrderProductItems logic.")
                }
                break;

            case 'payment_intent.succeeded':
                console.log("Payment Intent Succeeded for:", event.data.object.id)
                break;

            default:
                console.log(`Event type not handled specifically: ${event.type}`)
        }

        console.log("---------------- WEBHOOK FINISHED ----------------")
        response.json({ received: true });
    } catch (error) {
        console.error("FATAL WEBHOOK ERROR:", error.message)
        console.error(error.stack)
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

export async function getOrderDetailsController(request, response) {
    try {
        const userId = request.userId

        const orderlist = await OrderModel.find({ userId: userId }).sort({ createdAt: -1 }).populate('delivery_address')
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