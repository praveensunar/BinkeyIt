import { response } from 'express'
import CartProductModel from '../Models/cartproduct.model.js'
import UserModel from '../Models/user.model.js'


export const addToCartItemController = async (request, response) => {
    try {
        const userId = request.userId
        const { productId } = request.body

        if (!userId) {
            return response.status(401).json({
                message: "Unauthorized user",
                error: true,
                success: false
            })
        }

        if (!productId) {
            return response.status(400).json({
                message: "Provide ProductId",
                error: true,
                success: false
            })
        }
        const checkItemCart = await CartProductModel.findOne({
            userId: userId,
            productId: productId
        })
        if (checkItemCart) {
            return response.status(400).json({
                message: "Item already in Cart"
            })
        }

        const cartItem = new CartProductModel({
            quantity: 1,
            userId: userId,
            productId: productId
        })
        const save = await cartItem.save()

        const udateCartUser = await UserModel.updateOne({ _id: userId }, {
            $push: {
                shopping_cart: productId
            }
        })

        return response.json({
            data: save,
            message: "item add successfully",
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const getCartItemController = async (request, response) => {
    try {
        const userId = request.userId

        const cartItem = await CartProductModel.find({
            userId: userId
        }).populate('productId')

        return response.json({
            data: cartItem,
            error: false,
            success: true
        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const updateCartItemQtyController = async (request, response) => {
    try {
        const userId = request.userId
        const { _id, qty } = request.body

        if (!_id || !qty) {
            return response.status(400).json({
                message: "provide _id and Qty"
            })
        }

        const updateCartitem = await CartProductModel.updateOne({
            _id: _id,
            userId: userId
        }, {
            quntity: qty
        })
        return response.json({
            message: "Updated Cart",
            success: true,
            error: false,
            data: updateCartitem

        })

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}
export const deleteCartItemController = async (request, response) => {
    try {
        const userId = request.userId
        const { _id } = request.body

        if (!_id) {
            return response.status(400).json({
                message: " Provide _id",
                success: false,
                error: true

            })
        }
        const daleteCartItem = await CartProductModel.deleteOne({ _id: _id, userId: userId })

        return response.json({
            message: "Item Removed",
            error: false,
            success: true,
            data: daleteCartItem
        })
    } catch (error) {
        return response.status(500).json({
            message: error.meesage || error,
            error: true,
            success: false
        })
    }
}

export const deleteAllCartItemController = async (request, response) => {
    try {
        const userId = request.userId

        // 1. Delete all items from the separate cart collection
        const deleteItems = await CartProductModel.deleteMany({ userId: userId })

        // 2. Clear the array in the user model
        const clearUserCart = await UserModel.updateOne({ _id: userId }, { shopping_cart: [] })

        return response.json({
            message: "Cart cleared successfully",
            error: false,
            success: true,
            data: deleteItems
        })
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}