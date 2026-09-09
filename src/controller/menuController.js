import Menu from '../models/Menu.js'; 
import cloudinary from '../utils/cloudinary.js'
import fs from "fs"; // to remove local file after upload to cloudinary

// Helper function to remove local file
const removeLocalFile = (path) => {
    fs.unlink(path, (err) => { if(err) console.log(err) });
}

// CREATE
export const createMenu = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    if (!name || !price || !category || !description) {
      return res.status(400).json({ status: 'error', msg: 'All fields are required' });
    }

    let imageData = {};
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, { folder: "menu_images" });
        imageData = {
          imageUrl: result.secure_url,
          image_id: result.public_id
        };
        removeLocalFile(req.file.path);
      } catch (err) {
        console.error("Cloudinary error:", err);
        return res.status(500).json({ status: 'error', msg: 'Image upload failed' });
      }
    }

    const newMenu = new Menu({
      name,
      description,
      price,
      category,
      ...imageData
    });

    await newMenu.save();
    res.status(201).json({ status: 'success', data: newMenu });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ status: 'error', msg: 'Internal server error' });
  }
};


// GET ALL with filter + search
export const getMenu = async (req, res) => {
    try {   
        const { category, search } = req.query;
        let query = {};
        if(category) query.category = category;
        if(search) query.name = { $regex: search, $options: 'i' };

        const menus = await Menu.find(query).sort({ createdAt: -1 });
        res.status(200).json({status: 'ok', count: menus.length, data: menus});
    } catch (error) {
        res.status(500).json({status: 'error', msg: error.message});
    }
};

// GET BY ID
export const getMenuById = async (req, res) => {
    try {       
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({status: 'error', msg: 'Menu not found'});
        }
        res.status(200).json({status: 'ok', data: menu});
    } catch (error) {
        res.status(500).json({status: 'error', msg: error.message});
    }
};  

// UPDATE
export const updateMenu = async (req, res) => {
    try {
        let imageData = {};
        if(req.file) {
            const oldMenu = await Menu.findById(req.params.id);
            if(!oldMenu) return res.status(404).json({status: 'error', msg: 'Menu not found'});

            if(oldMenu.image_id) {
                await cloudinary.uploader.destroy(oldMenu.image_id);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: "menu_images",
            });
            imageData = {
                imageUrl: result.secure_url,
                image_id: result.public_id
            };
            removeLocalFile(req.file.path);
        }

        const menu = await Menu.findByIdAndUpdate(
            req.params.id, 
            { ...req.body, ...imageData }, 
            { new: true, runValidators: true }
        );
        if (!menu) {
            return res.status(404).json({status: 'error', msg: 'Menu not found'});
        }
        res.status(200).json({status: 'ok', msg: 'Menu updated successfully', data: menu});
    } catch (error) {
        if(req.file) removeLocalFile(req.file.path);
        res.status(500).json({status: 'error', msg: error.message});
    }
};

// DELETE
export const deleteMenu = async (req, res) => {
    try {
        const menu = await Menu.findById(req.params.id);
        if (!menu) {
            return res.status(404).json({status: 'error', msg: 'Menu not found'});
        }

        if(menu.image_id) {
            await cloudinary.uploader.destroy(menu.image_id);
        }
        await menu.deleteOne();
        res.status(200).json({status: 'ok', msg: 'Menu deleted successfully', data: menu});
    } catch (error) {
        res.status(500).json({status: 'error', msg: error.message});
    }
};