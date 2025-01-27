import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    payment : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Payment',
        required : true
    },
    checksIn :{
        type : Date,
        required : true
    }
},{timestamps : true});

export const Booking = mongoose.model('Booking', bookingSchema);