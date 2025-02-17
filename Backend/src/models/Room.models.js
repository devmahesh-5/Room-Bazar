import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rentPerMonth: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    },
    totalRooms: {
        type : Number,
        required: true
    },
    roomPhotos: [
        {
            type: String
        }
    ],
    thumbnail: {
        type: String,
        required: true
    },
    category : {
        type: String,
        required: true
    },
    location : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Location"
    },
    video : {
        type: String
    },
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ['Available', 'Booked', 'Reserved','CheckedIn'],
        default: 'Available',
      },
    booking :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Booking"
    },
    esewaId :{
        type : Number,
        required : true
    }
    
}, { timestamps: true });  

const Room = mongoose.model("Room", roomSchema);
export default Room