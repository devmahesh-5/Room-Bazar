import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
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
    status : {
        type : String,
        enum : ['Pending', 'Approved', 'Rejected'],
    },
    reason : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    
},{timestamps : true});