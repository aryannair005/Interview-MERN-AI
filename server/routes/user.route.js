import isAuth from "../middlewares/auth.middleware.js"
import {getCurrentUser} from "../controllers/user.controller.js" 
import express from "express"

const userRouter = express.Router()

userRouter.get("/current-user",isAuth,getCurrentUser)

export default userRouter