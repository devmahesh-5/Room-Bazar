import mongoose from "mongoose";
import Room from "./room.models.js";
import {ApiError} from "../utils/ApiError.js";
import Booking from "./booking.models.js";
const paymentSchema = new mongoose.Schema({
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
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Success', 'Failed'],
        default: 'Pending'
    },
    paymentGateway: {
        type: String
    },
    transaction_uuid: {
        type: String
    },
    refund :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Refund'
    },
    booking : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Booking'
    }
}, { timestamps: true });

paymentSchema.pre('save', async function (next) {
   try {
     if (!this.isModified('status')) next();
     const room = await Room.findById(this.roomId);
     if(!room) throw new ApiError(500, 'Room not found');
     
     const booking = await Booking.findOne({ roomId: this.roomId });
     if(!booking) throw new ApiError(500, 'Booking not found');

     booking.payment = this._id;
     await booking.save({ validateBeforeSave: false });
     if (this.status === 'Success') {
         room.status = 'Booked';
         booking.status = 'Booked';
         await room.save({ validateBeforeSave: false });
         await booking.save({ validateBeforeSave: false });
         next();
     } else if (this.status === 'Failed') {
         room.status = 'Available';
         booking.status = 'Reserved';
         await room.save({ validateBeforeSave: false });
         await booking.save({ validateBeforeSave: false });
         next();
     }
   } catch (error) {
     throw new ApiError(500, error.message);
   }
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;