import express from "express"
import jwt from "jsonwebtoken"
import User from "../models/user.js" 

//This code protects routes by verifying the JWT token stored in cookies. It ensures that only authenticated users can access certain routes.
export const protectRoute=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt  //write jwt as its a name of cookie //retreiving the jwt token from the cookie
        if (!token){
            return res.status(401).json({message:"Unauthorized access-No token provided"})
        }

        const decoded=jwt.verify(token,process.env.JWT_SECRET);  //decodes the token and if token is invalid return error
         if (!decoded)
            return res.status(401).json({message:"Unauthorized access-Invalid token"})

         const user=await User.findById(decoded.userId).select("-password")   //finding the user from the token through userid
         if (!user)
            return res.status(401).json({message:"User not found"})

         req.user=user;     
         next();

    }
    catch(error){
        console.log("Error occured",error.message)
        res.status(401).json({message:"Internal error occurred"+error.message})
    }
}