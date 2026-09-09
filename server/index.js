import express from "express"
import dotenv from "dotenv"
import connectDB from "./config/connectDB.js"
dotenv.config()


const app = express()
const PORT = process.env.PORT || 6000

app.use(express.json())

app.get("/",(req,res)=>{
    res.json({
        message : "Server Started"
     })
})

app.listen(PORT,()=>{
    console.log(`Server is listening to PORT : ${PORT}`)
    connectDB()
})