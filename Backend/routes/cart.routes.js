import { Router } from "express";
import CartProductModel from "../Models/cartproduct.model.js";
import auth from "../middleware/auth.js";
import { addToCartItemController, deleteCartItemController, getCartItemController, updateCartItemQtyController } from "../controllers/cart.controller.js";

const cartRouter = Router()

cartRouter.post('/create',auth,addToCartItemController)
cartRouter.get('/get',auth,getCartItemController)
cartRouter.put('/update-qty',auth,updateCartItemQtyController)
cartRouter.delete('/delete-cart-item',auth,deleteCartItemController)

export default cartRouter