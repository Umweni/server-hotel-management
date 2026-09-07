import express from "express";
import { registerUser, loginUser, getUserProfile, updateUserProfile } from "../controller/authController.js";
import validate_user from "../middleware/authMiddleware.js";

const router = express.Router();

//REGISTER USER
router.post('/register', registerUser);

//LOGIN USER
router.post('/login', loginUser);

//GET USER PROFILE
router.get('/profile', validate_user, getUserProfile);

//UPDATE USER PROFILE
router.put('/profile', validate_user, updateUserProfile);

export default router;
