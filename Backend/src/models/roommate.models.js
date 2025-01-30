import mongoose from "mongoose";

const roommateSchema = new mongoose.Schema({
    user1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

},{timestamps : true});

export const Roommate = mongoose.model('Roommate', roommateSchema);