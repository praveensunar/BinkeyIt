import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv .config()
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import connectDB from './config/connectDB.js'
import userRouter from './routes/user.route.js'
import categoryRouter from './routes/category.routes.js'
import uploadRouter from './routes/upload.routes.js'

const app = express()
app.use(cors({
    credentials : true,
    origin : process.env.FRONTEND_URL
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(morgan("dev"))
app.use(helmet({
    crossOriginResourcePolicy:false
}))

const PORT =  process.env.PORT || 8080

app.get("/",(req ,res)=>{
    //server to client 
    res.json({
        message :`server is Running ${PORT}`
    })
})

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/file',uploadRouter)

connectDB().then(()=>{
app.listen(PORT ,()=>{
    console.log("Server is Running...",PORT)
})
})
