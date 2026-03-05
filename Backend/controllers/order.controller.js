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
                            productId: item.productId._id,
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

        const params = {
            submit_type: 'pay',
            mode: 'payment',
            payment_method_types: ['card'],
            customer_email: user.email,
            metadata: {
                userId: userId.toString(),
                addressId: addressId.toString(),
                // REMOVED cartItems: JSON.stringify(cartItemsMetadata) 
                // We no longer need this heavy string because we use PRE-ORDERS
            },
            line_items: line_items,
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        }

        const session = await Stripe.checkout.sessions.create(params)

        if (session.id) {
            // NEW: Create PENDING orders in DB immediately
            const orderPayload = list_items.map(item => ({
                userId: userId,
                orderId: `ORD-${new mongoose.Types.ObjectId()}`,
                productId: item.productId._id,
                product_details: {
                    name: item.productId.name,
                    image: item.productId.image?.[0] || Object.values(item.productId.image)[0] // Robust extraction
                },
                paymentId: session.id, // Link to Stripe Session ID
                payment_status: "PENDING",
                delivery_address: addressId,
                subTotalAmt: subTotalAmt,
                totalAmt: totalAmt,
            }));

            await OrderModel.insertMany(orderPayload);
            console.log(`Pre-orders created for user ${userId} with Session ID: ${session.id}`);
        }

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
        cartItemsMetadata // New parameter
    }) => {

    // If we have cartItemsMetadata directly from session, use it! It's much faster and more reliable.
    if (cartItemsMetadata && cartItemsMetadata.length > 0) {
        return cartItemsMetadata.map(item => ({
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
        }));
    }

    // Fallback to the old method if metadata is missing (unlikely but safe)
    const productList = []
    try {
        if (lineItems?.data?.length) {
            for (const item of lineItems.data) {
                const product = await Stripe.products.retrieve(item.price.product)
                const productId = product.metadata.productId;

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
        console.error("Error in fallback getOrderProductItems:", error);
    }
    return productList
}
// http://localhost:8080/
export async function webHookPayment(request, response) {
    try {
        const event = request.body

        console.log("---------------- WEBHOOK EVENT ----------------")
        console.log("Type:", event.type)

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const sessionId = session.id;
            const userId = session.metadata?.userId;

            console.log(`Payment confirmed for Session: ${sessionId}`);

            // Find and update all pending orders linked to this session
            const updateResult = await OrderModel.updateMany(
                { paymentId: sessionId },
                {
                    payment_status: "PAID",
                    paymentId: session.payment_intent // Update to real payment intent ID
                }
            );

            console.log(`Updated ${updateResult.modifiedCount} orders to PAID status.`);

<<<<<<< HEAD
            if (userId) {
                // Clear cart only after successful payment confirmation
                await UserModel.findByIdAndUpdate(userId, { shopping_cart: [] });
                await CartProductModel.deleteMany({ userId: userId });
                console.log(`Cart cleared for user ${userId}`);
=======
            if (order) {
                const removeCartItems = UserModel.findByIdAndUpdate(userId, {
                    shoppin_cart: []
                })
                const removeCartProductDB = CartProductModel.deleteMany({ _id: userId })
>>>>>>> parent of c7a8190 (fix: correct shopping cart update logic in webHookPayment function)
            }
        }

        console.log("---------------- WEBHOOK END ----------------")
        response.json({ received: true });
    } catch (error) {
        console.error("WEBHOOK ERROR:", error.message)
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