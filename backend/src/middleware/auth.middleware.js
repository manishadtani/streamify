import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";



export const protectedRoute = async (req,res,next) =>{
    try {
        const token = req.cookies.jwt
        if(!token){
        return res.status(401).json({message: "Unauthorized - No token provided"})
        }

       const decoded = jwt.verify(token, process.env.JWT_SECRET)

       if(!decoded){
        return res.status(401).json({message: "Unauthorized - Invalid token"})
       }

       const user = await userModel.findById(decoded.userId).select("-password")

       if(!user){
        return res.status(401).json({message: "Unauthorized - user not found"})
       } 

       req.user = user
       next();

    } catch (error) {
        console.log("error in protected route "+error)
        res.status(500).json({message:"Protected Middleware error"})
        
    }
}