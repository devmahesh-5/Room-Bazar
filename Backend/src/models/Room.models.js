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
    price: {
        type: Number,
        required: true
    },
    maxPeople: {
        type: Number,
        required: true
    },
    roomNumbers: {
        type : Number,
        required: true
    },
    photos: [
        {
            type: String
        }
    ],
    category : {
        type: String,
        required: true
    },
    location : {
        type: String,
        required: true
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
        enum: ['Available', 'Booked', 'Reserved'],
        default: 'Available',
      }
    
}, { timestamps: true });  

export default mongoose.model("Room", roomSchema);
    