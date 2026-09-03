import express from "express";
import { createGuest, getGuest, getGuestById, updateGuest, deleteGuest } from "../controller/guestController.js";

const router = express.Router();

//create new guest
router.post('/guest', createGuest); 

//fetch all guests
router.get('/guests', getGuest);

//fetch single guest by id
router.get('/guest/:id', getGuestById);

//update guest by id
router.put('/guest/:id', updateGuest);

//delete guest by id
router.delete('/guest/:id', deleteGuest);

export default router;