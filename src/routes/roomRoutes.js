import express from 'express';
import { getRoom, createRoom, getRoomById, updateRoom, deleteRoom  } from '../controller/roomController.js';
const router = express.Router();

//get all room
router.get('/', getRoom);

//create room
router.post('/', createRoom);

//get room by ID
router.get('/:id', getRoomById);

//update room by ID
router.put('/:id', updateRoom);

//delete room by ID
router.delete('/:id', deleteRoom);

export default router;