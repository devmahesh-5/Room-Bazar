import mongoose from "mongoose";

const refundSchema = new mongoose.Schema({
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
    status : {
        type : String,
        enum : ['Pending', 'Approved', 'RejectedByOwner', 'RejectedByAdmin'],
        default : 'Pending'
    },
    reason : {
        type : String,
        required : true
    },
    amount : {
        type : Number,
        required : true
    },
    ownerRejectionReason : {
        type : String
    },
    ownerRejectionPhotos : [
        {
            type : String
        }
    ],
    payment :{
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Payment',
    }
    
},{timestamps : true});

const Refund = mongoose.model('Refund', refundSchema);

refundSchema.pre("save", async function (next) {
        if(!this.isModified("status")){
            next();
        }else{
            //here call the function for payment
            next(); 
        }
    })



export default Refund;