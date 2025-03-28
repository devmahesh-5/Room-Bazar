import mongoose from "mongoose";

const roommateRequestSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roommate',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Roommate',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    }
},{timestamps : true});

const RoommateRequest = mongoose.model('RoommateRequest', roommateRequestSchema);
export default RoommateRequest