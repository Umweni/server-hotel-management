import Room from '../models/Room.js'

//fetch all room
export const getRoom = async (req, res) => {
    try {
        const rooms = await Room.find();
        res.status(200).send({status: 'Ok', msg: 'success'})
    } catch (error) {
        console.error(error);
        return res.status(500).send({status: 'error', msg: 'some error occurred'})
    }
};

//create room
export const createRoom = async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
    } catch (error) {
       console.error(error);
       return res.status(400).send({status: 'error', msg: 'fill requied field'});
    }
};

//get single room by Id
export const getRoomById = async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if(!room) return res.status(404).send({status: 'error', msg: 'Room Not Found'});
        res.status(200).send({status: 'ok', msg: 'Room Found'})
    } catch (error) {
        console.error(error);
        return res.status(500).send({status: 'error', msg: 'Server error'})
    }
};

//update a room
export const updateRoom = async (req, res) => {
   try {
     const room = await Room.findByIdAndUpdate(req.params.id, req.body,{
        new: true,
        runValidators: true
    });
    if (!room) return res.status(400).send({status: 'error', msg: 'Room Not Found'});
    res.status(200).send({status: 'ok', msg: 'successful updated'})
   } catch (error) {
    console.log(error)
    return res.status(500).send({status: 'error', msg: 'server error'})
   }
}

//Delete a room
export const deleteRoom = async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if(!room) return res.status(404).send({status: 'error', msg: 'Room not found'})
            res.status(200).send({staus: 'ok', msg: 'successful deleted'})
    } catch (error) {
        console.error(error);
        return res.status(500).send({status: 'error', msg: 'server error'})
    }
}

