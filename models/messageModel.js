import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    fname:String,
    lname:String,
    email:String,
    message:String,
})

export const UserMsg = mongoose.model("UserMsg",messageSchema);
