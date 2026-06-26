import express from "express";
import { protectRoute } from "../middlewares/protect.js";
import User from "../models/user.js";
import Message from "../models/message.js"
import cloudinary from "../lib/cloudinary.js";
import {getRecieversocketid, io} from "../lib/socket.js"

const router=express.Router();

router.get("/users",protectRoute,async(req,res)=>{
    try{
        const userid=req.user._id;
        const otherusers=await User.find({_id:{$ne:userid}}).select("-password");  //finding all the users except myself

        res.status(200).json(otherusers)
    }
    catch(error){
        console.log("Error in getting users ",error.message)
        res.status(400).json({message:"Internal server error"+error.message})
    }
})

router.get("/:id",protectRoute,async (req,res)=>{
    try{
        const {id:usertochatid}=req.params; 
        const myid=req.user._id;    //me
        const messages=await Message.find({        //finding all the messages between me and jeni sathe vat karu
            $or:[
                {senderId:myid, receiverId:usertochatid},
                {senderId:usertochatid, receiverId:myid},
            ]
        })
        res.status(200).json(messages)
    }
    catch(error){
        console.log("Error in messages ",error.message)
        res.status(401).json({message:"internal server error "+error.message})
    }
})

router.post("/send/:id",protectRoute,async(req,res)=>{
    try{
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageurl;
        if (image){
            const uploadres=await cloudinary.uploader.upload(image)  //uploading the img to cloudinary
            imageurl=uploadres.secure_url;
        }
        const NewMessage=new Message({
            senderId,receiverId,text,
            image:imageurl
        });
        await NewMessage.save();

        //for realtime
        const receiversocketid=getRecieversocketid(receiverId);
        if (receiversocketid) io.to(receiversocketid).emit("New msg",NewMessage);


        res.status(201).json(NewMessage)
    }
    catch(error){
        console.log("Error in sending message: ",error.message)
        res.status(400).json({message:"Internal server error "+error.message})
    }
 })








export default router;