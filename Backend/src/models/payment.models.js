import mongoose from "mongoose";
import Room from "./room.models.js";
import {ApiError} from "../utils/ApiError.js";
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
    }
}, { timestamps: true });

paymentSchema.pre('save', async function (next) {
   try {
     if (!this.isModified('status')) next();
     const room = await Room.findById(this.roomId);
     if(!room) throw new ApiError(500, 'Room not found');
     
     const Booking = await Booking.findOne({ roomId: room._id });
     if(!Booking) throw new ApiError(500, 'Booking not found');

     Booking.Payment = this._id;
     await Booking.save({ validateBeforeSave: false });
     if (this.status === 'Success') {
         room.status = 'Booked';
         await room.save({ validateBeforeSave: false });
         next();
     } else if (this.status === 'Failed') {
         room.status = 'Available';
         await room.save({ validateBeforeSave: false });
         next();
     }
   } catch (error) {
     throw new ApiError(500, error.message);
   }
});

export const Payment = mongoose.model('Payment', paymentSchema);