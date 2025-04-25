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
    },
    status:{
        type : String,
        enum : ['Reserved', 'Booked', 'CheckedIn'],
        default : 'Reserved'
    },
    reservedAt: {
        type: Date
    }
},{timestamps : true});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking