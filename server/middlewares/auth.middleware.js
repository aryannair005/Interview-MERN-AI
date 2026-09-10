import jwt from "jsonwebtoken"


const isAuth = async (req,res,next) =>{
    try {
        const {token} = req.cookies
        if(!token){
            return res.status(401).json({
                message:"Token doesn't exist"
            })
        }

        const user = jwt.verify(token,process.env.JWT_SECRET)
        if(!user){
            return res.status(400).json({message:"user doesn't have a valid token"})
        }

        req.userId = user.userId
        next()
    } catch (error) {
        return res.status(401).json({
            message:"Invalid or expired token"
        })
    }
}

export default isAuth