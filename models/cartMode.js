import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    phone: Number,
    path: String,
    prize: Number, 
    gender: Boolean,
    quantity: Number,
    paymet: Boolean
});
export const Cart = mongoose.model("Cart",cartSchema);
