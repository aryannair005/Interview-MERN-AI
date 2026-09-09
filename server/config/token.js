import jwt from "jsonwebtoken"

const genToken = async (userId)=>{
    try{
        const token = jwt.sign({userId} , process.env.JWT_SECRET , {expiresIn : "7d"})
        return token
    }catch(error){
        console.log(`Error in token generation : ${error}`)
    }
}

export default genToken