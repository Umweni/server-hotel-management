import express from 'express';
import { getRoom, createRoom, getRoomById, updateRoom, checkAvailableRooms, checkRoomAvailability, deleteRoom  } from '../controller/roomController.js';
const router = express.Router();

//get all room
router.get('/fetchRooms', getRoom);

//create room
router.post('/createRoom', createRoom);

//check available rooms
router.get('/available', checkAvailableRooms);

//check room availability
router.get('/available/:roomNumber', checkRoomAvailability)

//get room by ID
router.get('/:id', getRoomById);

//update room by ID
router.put('/:id', updateRoom);

//delete room by ID
router.delete('/:id', deleteRoom);

export default router;