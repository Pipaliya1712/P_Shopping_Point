import mongoose from "mongoose";

const placeOrderSchema = new mongoose.Schema({
    phonef:Number,
    email:String,
    fname:String,
    lname:String,
    cname:String,
    country:String,
    city:String,
    state:String,
    zip:Number,
    address:String,
    phone:Number,
    note:String,
    date: Date,
    product:[{
        prize: Number, 
        gender: Boolean,
        quantity: Number,
    }]
})

export const PlaceOrder = mongoose.model("PlaceOrder",placeOrderSchema);
