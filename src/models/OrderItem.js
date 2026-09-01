import mongoose from "mongoose";

const  orderItemSchema = new mongoose.Schema({
    name:{
        type: String,
    },
    price:{
        type: Number
    },
    quantity:{
        type: Number,
        required: true
    },
    notes:{
        type: String
    },

}, { _id: false }); // prevents auto _id 

const orderSchema = new mongoose.Schema({
    purchaseId:{
        type: String,
        unique: true
    }
})