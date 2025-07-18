import mongoose from "mongoose";

const locationSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    latitude: {
        type: Number,
    },
    longitude: {
        type: Number,
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    roomid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Room',
    },
    roomOwner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
    },
    roommate : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Roommate',
    }
},{timestamps : true});

const Location = mongoose.model('Location', locationSchema);
export default Location