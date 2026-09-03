import express from "express";
import upload from "../utils/multer.js";
import { createMenu, getMenu, getMenuById, updateMenu, deleteMenu } from "../controller/menuController.js";

const router = express.Router();

//create new menu
router.post('/menu', upload.single('image'), createMenu);

//fetch all menus
router.get('/menu', getMenu);

//fetch single menu by id
router.get('/menu/:id', getMenuById);

//update menu by id
router.put('/menu/:id', upload.single('image'), updateMenu);

//delete menu by id
router.delete('/menu/:id', deleteMenu);

export default router;