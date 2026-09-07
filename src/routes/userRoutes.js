import express from 'express';
import { registerUser, getUsers, updateUser, deleteUser  } from '../controller/userController.js';
import validate_user from '../middleware/authMiddleware.js';

const router = express.Router();

//REGISTER USER
router.post('/register', registerUser);

//fetch all user
router.get('/users', validate_user, getUsers);

//UPDATE USER BY ID
router.put('/users/:id', validate_user, updateUser);

//DELETE USER BY ID
router.delete('/users/:id', validate_user, deleteUser);

export default router;