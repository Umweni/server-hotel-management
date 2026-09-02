import mongoose from "mongoose";

const  orderItemSchema = new mongoose.Schema({
    menuItem:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    notes:{
        type: String
    },

}, { _id: false }); // prevents generating -id for each order item

const orderSchema = new mongoose.Schema({
    purchaseId:{
        type: String,
        unique: true,
        required: true
    },
    items:[orderItemSchema],
    customer:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['PENDING', 'PREPARING', 'READY', 'DELIVERED', 'CANCELLED'],
        default: 'PENDING'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;