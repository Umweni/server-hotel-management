import Booking from "../models/Booking";
import Room from "../models/Room";
import Guest from "../models/Guest";


//create new booking
export const createBooking = async (req, res) => {
    try {
        const { roomId, guestId, checkInDate, checkOutDate, totalPrice } = req.body;
        const booking = new Booking({ roomId, guestId, checkInDate, checkOutDate, totalPrice });
        await booking.save();
        res.status(201).send({status: 'ok', msg: 'Booking created successfully', data: booking});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//check room availability
export const checkRoomAvailability = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate } = req.body;
        const bookings = await Booking.find({
            roomId,
            checkInDate: {$lt: new Date(checkOutDate)},
            checkOutDate: {$gt: new Date(checkInDate)}
        });
        res.status(200).send({status: 'ok', msg: 'Room availability checked successfully', data: bookings});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//upgrade booking by id
export const upgradeBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!booking) {
            return res.status(404).send({status: 'error', msg: 'Booking not found'});
        }
        res.status(200).send({status: 'ok', msg: 'Booking upgraded successfully', data: booking});

    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//cancel booking by id
export const cancelBooking = async (req, res) => {
    try{
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if(!booking){
            return res.status(404).send({status: 'error', msg: 'Booking not found'});
        }
        
        res.status(200).send({status: 'ok', msg: 'Booking cancelled successfully', data: booking});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
}