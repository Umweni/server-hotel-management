import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    roomNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },


    description:{
        type: String,
        trim: true
    },

    category:{
        type: String,
        required: true,
        enum:[
        "SINGLE",
        "DOUBLE",
        "TWIN",
        "TRIPLE",
        "QUAD",
        "STANDARD",
        "SUPERIOR",
        "DELUXE",
        "STUDIO",
        "JUNIOR_SUITE",
        "EXECUTIVE_SUITE",
        "PRESIDENTIAL_SUITE",
        "ACCESSIBLE",
        ],
    },

    capacity:{
        type: Number,
        required: true,
        min: 1
    },

    bedType:{
        type: String,
        required: true,
        enum: ["SINGLE", "DOUBLE", "QUEEN", "KING", "TWIN"]
    },

    price:{
        type: Number,
        required: true,
        min: 20000
    },

    floor:{
        type: Number,
        required: true
    },
    size:{
        type: Number
    },   // This list of lodging types is perhaps the simplest of all. If someone asks “what are three
         // different types of hotel properties?” you can say small (<25 rooms), medium 
        // (26-300 rooms) and large (>300 rooms).


    status:{
        type: String,
        enum:["AVAILABLE", "OCCUPIED"],
        default: "AVAILABLE"
    },
    images:{
        type: String
    }
},{timestamps: true});

const Room = mongoose.model("Room", roomSchema);

export default Room;