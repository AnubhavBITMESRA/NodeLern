import jwt from "jsonwebtoken"
import config from "../config.js"
function userMiddleware(req,res,next) {
   const authHeader = req.headers.authorization

   if(!authHeader || !authHeader.startsWith("Bearer")){
    return res.status(401).json({errors:"No token provided....!!"})
   }

   const token = authHeader.split(" ")[1]
   try {
    const decodedToken = jwt.verify(token,config.JWT_SECRET)
    req.userId=decodedToken.id
    next()
   } catch (error) {
    return res.status(500).json({errors:"Invalid token or token expired!!"})
    console.log("Invalid token or token expired!!",error)
   }
}

export default userMiddleware