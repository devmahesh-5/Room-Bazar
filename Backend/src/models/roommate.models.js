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

const Roommate = mongoose.model('Roommate', roommateSchema);
export default Roommate