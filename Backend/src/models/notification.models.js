import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    receiver: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    message: {
        type: String,
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment'
    },
    roommateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roommate'
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    reportId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Report'
    },
    isRead: {
        type: Boolean,
        default: false
    }
},{timestamps : true});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification