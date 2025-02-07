import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    reporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room'
    },
    reason: {
        type: String,
        required: true
    },
    roomOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{timestamps : true});

const Report = mongoose.model('Report', reportSchema);
export default Report