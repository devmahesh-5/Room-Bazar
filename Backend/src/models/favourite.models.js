import mongoose from "mongoose";

const favouriteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    }
},{timestamps : true});

export const Favourite = mongoose.model('Favourite', favouriteSchema);