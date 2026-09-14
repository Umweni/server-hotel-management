import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{
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
        required: false,
        trim: true,
        minlength: 6,
        select: false
    },
    guest:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Guest"
    },

   role:{
    type: String,
    enum:["STAFF", "GUEST"],
    required: true
   },

   status:{
    type: String,
    enum:['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
   },
},{timestamps: true});

const User = mongoose.model("User", userSchema);
export default User;