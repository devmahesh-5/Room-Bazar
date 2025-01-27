import mongoose from "mongoose";

const roommateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    pets :{
        type : String,
        required : true
    },
    haveRoom : {
        type : Boolean,
        required : true
    }

},{timestamps : true});

export const Roommate = mongoose.model('Roommate', roommateSchema);