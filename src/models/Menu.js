import mongoose from "mongoose";

const menuSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    description:{
        type: String,
        trim: true
    },
    price:{
        type: Number,
        required: true,
        min: 4000
    },
    category:{
        type: String,
        enum: ['APPETIZER', 'MAIN_COURSE', 'DESSERT', 'DRINK', 'BAR'],
        required: true
    },
    status:{
        type: String,
        enum: ['AVAILABLE', 'UNAVAILABLE'],
        default: 'AVAILABLE'
    },
    image:{
        type: String
    }

}, {timestamps: true});

const Menu = mongoose.model("Menu", menuSchema);
export default Menu;