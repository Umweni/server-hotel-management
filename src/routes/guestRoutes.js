import express from "express";
import { guestSignup, guestLogin, getGuest, getGuestById, updateGuest, deleteGuest } from "../controller/guestController.js";

const router = express.Router();

// signup new guest
router.post('/signup', guestSignup);

// login guest
router.post('/login', guestLogin);

// fetch all guests
router.get('/guests', getGuest);

// fetch single guest by id
router.get('/guest/:id', getGuestById);

// update guest by id
router.put('/guest/:id', updateGuest);

// delete guest by id
router.delete('/guest/:id', deleteGuest);

export default router;
