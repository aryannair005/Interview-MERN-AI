import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"
import authRouter from "./routes/auth.route.js"
import cookieParser from "cookie-parser";
import cors from "cors"
dotenv.config()


const app = express()
const PORT = process.env.PORT || 6000

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}))

// Routes 

// Auth Routes
app.use("/api/auth",authRouter) 

app.listen(PORT,()=>{
    console.log(`Server is listening to PORT : ${PORT}`)
    connectDB()
})