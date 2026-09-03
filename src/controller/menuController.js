import Menu from "../models/Menu";
import cloudinary from "../../utils/cloudinary";


//create new menu
export const createMenu = async (req, res) => {
    try {
        const { name, description, price, category } = req.body;
        if(!name || !price || !category || !description){
            return res.status(400).send({status: 'error', msg: 'required field must be filled'});
        }

        let imageData = {};
        if(req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "menu_images",
            });
                    //assign the image url and public id to the imageData object
                imageData = {
                    imageUrl: result.secure_url,
                    image_id: result.public_id
                };
            }

        const menu = new Menu({ ...req.body, ...imageData });
        await menu.save();
        res.status(201).send({status: 'ok', msg: 'Menu created successfully', data: menu});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//fetch all menu
export const getMenu = async (req, res) => {
    try {   
        const menus = await Menu.find();
        res.status(200).send({status: 'ok', msg: 'Menus fetched successfully', data: menus});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//fetch single menu by id
export const getMenuById = async (req, res) => {
    try {       
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).send({status: 'error', msg: 'Menu not found'});
        }
        res.status(200).send({status: 'ok', msg: 'Menu fetched successfully', data: menu});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};  

//update menu by id and handle image upload
export const updateMenu = async (req, res) => {
    try {
        let imageData = {};
        if(req.file) {
            const oldMenu = await Menu.findById(req.params.id);
            if(oldMenu && oldMenu.image_id) {
                await cloudinary.uploader.destroy(oldMenu.image_id);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "menu_images",
            });
            imageData = {
                imageUrl: result.secure_url,
                image_id: result.public_id
            };
        }

        const menu = await Menu.findByIdAndUpdate(req.params.id, { ...req.body, ...imageData }, { new: true, runValidators: true });
        if (!menu) {
            return res.status(404).send({status: 'error', msg: 'Menu not found'});
        }
        res.status(200).send({status: 'ok', msg: 'Menu updated successfully', data: menu});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

//delete menu by id and remove image from cloudinary
export const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findByIdAndDelete(req.params.id);
        if (!menu) {
            return res.status(404).send({status: 'error', msg: 'Menu not found'});
        }

        if(menu.image_id) {
            await cloudinary.uploader.destroy(menu.image_id);
        }
        await menu.deleteOne();
        res.status(200).send({status: 'ok', msg: 'Menu deleted successfully', data: menu});
    } catch (error) {
        res.status(400).send({status: 'error', msg: error.message});
    }
};

