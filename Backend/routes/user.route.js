import { Router } from 'express'
import { loginController, logoutController, registerUserController, verifyEmailcontroller } from '../controllers/user.controller.js'
import auth from '../middleware/auth.js'

const userRouter = Router()

userRouter.post('/register',registerUserController)
userRouter.post('/verify-email',verifyEmailcontroller)
userRouter.post('/login',loginController)
userRouter.get('/logout',auth,logoutController)

export default userRouter