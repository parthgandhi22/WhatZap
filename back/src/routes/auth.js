import express from "express"
import User from "../models/user.js"
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { protectRoute } from "../middlewares/protect.js"
import cloudinary from "../lib/cloudinary.js"

const router=express.Router();      //if users enter /api/auth/signup it accepts request of singup

router.post("/signup",async (req,res)=>{
    const {name,Email,pwd}=req.body;
    try{
        if (!name || !Email || !pwd)
            return res.status(400).json({message:"All fields are required"})

        if (pwd.length<6)
             return res.status(400).json({message:"Pwd must be atleast 6 characters"})

        const user=await User.findOne({email:Email});
        if (user)
            return res.status(400).json({message:"Email already exist"})

        const salt=await bcrypt.genSalt(10);
        const hashedpwd=await bcrypt.hash(pwd,salt);

        const NewUser=new User({
            fullname:name,
            email:Email,
            password:hashedpwd,
        });

        if (NewUser){
            //generate token
            generateToken(NewUser._id,res)
            await NewUser.save();
            
            res.status(201).json({
                _id:NewUser._id,
                fullname:NewUser.fullname,
                email:NewUser.email,
                profilepic:NewUser.profilepic,
                createdAt:NewUser.createdAt
            });

        }else{
            res.status(400).json({message:"Invalid user data"})
        }
    }

    catch(error){
        console.log("Error in signup:",error)
        res.status(400).json({message:"Internal Server Error" + error.message});
    }

})

router.post("/login",async (req,res)=>{
    const {Email,pwd}=req.body;
    try{
        const user= await User.findOne({email:Email});
        if (!user){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const pwdcorrect=await bcrypt.compare(pwd,user.password)
        if (!pwdcorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }
        generateToken(user._id,res);   //generating token
        res.status(200).json({
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            profilepic:user.profilepic,
            createdAt:user.createdAt
        });
    }
    catch(error){
        console.log("Error occured in login",error.message)
        res.status(400).json({message:"Internal Server Error" + error.message});
    }
})

router.post("/logout",(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0})         //deleting the cookie once logged out
        res.status(200).json({message:"Logged out successfully"})
    } 
    catch(error){
        console.log("Error in logout:",error.message)
        res.status(400).json({message:"Internal Server Error" + error.message});
    }
})

router.put("/update-profile",protectRoute,async (req,res)=>{         //protectroute is middleware
    //only authenticated users can update the profile
    //first middleware protectRoute is enabled which checks the token
    try{
    const {profilepic}=req.body;
    const userId=req.user._id;

    if (!profilepic)
        return res.status(400).json({message:"Profile pic is required"})

    const upload =await cloudinary.uploader.upload(profilepic)       //cloudinary stores the image and returns secure image url
    const updateUser=await User.findByIdAndUpdate(userId,{profilepic:upload.secure_url},{new:true});

    res.status(200).json(updateUser)
}
    catch(error){
        console.log("Error in updating profile",error.message)
        res.status(400).json({message:"Internal server error "+error.message})
    }
})

router.get("/check",protectRoute,(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("Error in checkAuth controller",error.message)
        res.status(500).json({message:"Internal server error"+error.message})
    }
})

export default router;