import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: true
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED'],
        default: 'PENDING'
    }
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);
export default Order;
