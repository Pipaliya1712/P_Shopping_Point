import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:String,
    phone:Number,
    email:String,
    password:String,
    isLogin:Boolean,
    isverified:{
        type:Boolean,
        default:false
    },
    file:String
})

export const User =  mongoose.model("User", userSchema);
