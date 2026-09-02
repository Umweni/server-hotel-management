import express from 'express';
import { registerUser, getUser, updateUser, deleteUser  } from '../controller/userController.js';
import router from './roomRoutes.js';

const express = express.Router();

//REGISTER USER
router.post('/', registerUser);

//fetch all user
router.get('/', getUser);

//UPDATE USER BY ID
router.get('/:id', updateUser);

//DELETE USER BY ID
router.delete('/:id', deleteUser);

export default router;