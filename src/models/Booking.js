import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    roomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    guestId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guest',
        required: false
    }, 
    checkInDate:{
        type: Date,
        required: true
    },
    checkOutDate:{
        type: Date,
        required: true
    },
    totalPrice:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'PENDING'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
