import express from 'express';
import { getRoom, createRoom, getRoomById, updateRoom, checkAvailableRooms, deleteRoom  } from '../controller/roomController.js';
const router = express.Router();

//get all room
router.get('/fetchRooms', getRoom);

//create room
router.post('/createRoom', createRoom);

//get room by ID
router.get('/:id', getRoomById);

//update room by ID
router.put('/:id', updateRoom);

//check available rooms
router.get('/available', checkAvailableRooms);

//delete room by ID
router.delete('/:id', deleteRoom);

export default router;