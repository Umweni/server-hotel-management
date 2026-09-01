import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName:{
        type: String
    },

    
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    password:{
        type: String,
        required: true,
        trim: true,
        minlength: 6,
        select: false
    },

   role:{
    type: String,
    enum:['ADMIN', 'MANAGER', 'RECEPTIONIST', 'CHEF', 'WAITER', 'HOUSEKEEPING'],
    default: 'RECEPTIONIST'
   },

   status:{
    type: String,
    enum:['ACTIVE', 'INACTIVE'],
    default: ACTIVE
   },
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;