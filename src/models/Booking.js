import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    room:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    guest:{
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
    totalAmount:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'],
        default: 'CONFIRMED'
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
