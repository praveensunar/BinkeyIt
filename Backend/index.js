import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './routes/user.route.js'
import categoryRouter from './routes/category.routes.js'
import uploadRouter from './routes/upload.routes.js'
import subcategoryRouter from './routes/subCategory.routes.js'
import productRouter from './routes/product.routes.js'
import cartRouter from './routes/cart.routes.js'
import addressRouter from './routes/address.routes.js'
import orderRouter from './routes/order.route.js'

const app = express()

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "https://binkeyit-clone.netlify.app",
    "http://localhost:5173"
].filter(Boolean); // Remote any undefined/null values

app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("CORS Rejected for Origin:", origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Some legacy browsers crash on 204
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy: false
}))

const PORT = process.env.PORT || 8080

app.get("/", (req, res) => {
    //server to client 
    res.json({
        message: `server is Running ${PORT}`
    })
})

app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter)
app.use('/api/file', uploadRouter)
app.use('/api/subcategory', subcategoryRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server is Running...", PORT)
    })
})
