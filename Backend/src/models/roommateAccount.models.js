import mongoose from "mongoose";

const roommateSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    job : {
        type : String,
        required : true
    },
    pets :{
        type : String,
        required : true
    },
    smoking : {
        type :Boolean,
        required : true
    },
    haveRoom : {
        type : Boolean,
        required : true
    },
    roomPhotos : [
       { type : String}
    ],
    description :{
        type : String,
        required : true
    },
    location :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Location'
    },
    address:{
        type : String,
    },
    latitude:{
        type : Number,
    },
    longitude :{
        type: Number
    }

},{timestamps : true});

const RoommateAccount = mongoose.model('RoommateAccount', roommateSchema);

export default RoommateAccount
