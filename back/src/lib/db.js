import mongoose from "mongoose";
export const connectdb=async ()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGODB_URI)
        console.log("mongodb connected")
    }
    catch(error){
        console.log("error generated",error);
        throw error;
    }
}