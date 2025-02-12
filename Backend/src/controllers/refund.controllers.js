//check the api endpoint for refund

import Refund from "../models/refund.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import { isValidObjectId } from "mongoose";
import { uploadMultipleFilesOnCloudinary } from "../utils/Cloudinary.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import Payment from '../models/payment.models.js';
import Booking from "../models/booking.models.js";

const createRefund = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const roomId = req.params?.roomId;
    const userId = req.user?._id;

    if (!isValidObjectId(userId) || !isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid user id or room id');
    }

    if (!reason || reason.trim() === '') {
        throw new ApiError(400, 'Reason is required');
    }
    
    const existingRefund = await Refund.findOne({
        roomId,
        userId
    })

    if (existingRefund) {
        throw new ApiError(400, 'Refund already exists');
    }

    const room = await Room.findById(roomId);
    if (!room) {
        throw new ApiError(404, 'Room not found');
    }

    const bookedRoom = await Booking.findOne({
        roomId,
        userId
    })
    if(!bookedRoom){
        throw new ApiError(400, 'You have not booked this room');
    }

    if(bookedRoom.status!=='Booked'){
        throw new ApiError(400, 'You have not booked this room or Already checked in');
    }
    
    const amount = (room.price) * 0.9;

    if (!amount) {
        throw new ApiError(500, 'Failed to get room price');
    }

    const payment = await Payment.findOne(
        {
            roomId,
            userId
        }
    )
    if (!payment) {
        throw new ApiError(500, 'Payment not found');
    }
    const refund = await Refund.create({
        userId,
        roomId,
        status: 'Pending',
        reason,
        amount,
        payment: payment._id
    })

    if (!refund) {
        throw new ApiError(500, 'Failed to create refund');
    }

    const user = await User.findById(userId);

    await Notification.create({
        receiver: [user._id, room.owner],
        message: `Room ${room.title} has been requested for Refund by ${user.fullName}`,
        refundId: refund._id,
        roomId: room._id
    })
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                refund,
                'Refund created successfully'
            )
        )

});

const updateRefund = asyncHandler(async (req, res) => {
    const refundId = req.params?.refundId;
    const { status } = req.body;

    const oldRefund = await Refund.findById(refundId);
    
    const room = await Room.findById(oldRefund.roomId);

    if(room.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(400,"Only Owner can Approve Refund Request")
    }
    
    const updatedRefund= await Refund.findOneAndUpdate(
        {
            _id:refundId,
            
            $or:[
                    {status:'Pending'},
                    {status:'RejectedByOwner'}
                ]
            
        },
        {
            $set: {
                status
            }
        },
        {
            new: true
        }
    )

    if (!updatedRefund) {
        throw new ApiError(500, 'Failed to update refund');
    }
    
    
    if (updatedRefund.status === 'Approved') {
        await Notification.create({
            receiver: [updatedRefund.userId, room.owner],
            message: `Room refund request has been approved.you will get refund soon`,
            refundId: updatedRefund._id,
            roomId: updatedRefund.roomId
        })

        //here send the refund request to esewa with apiEndpoint

        const payment = await Payment.findOne({ _id: updatedRefund.payment });

        if (!payment) {
            throw new ApiError(500, 'Failed to get payment');
        }

        const total_amount = payment.amount * 0.9;
        const transaction_uuid = payment.transaction_uuid;
        const product_code = payment.paymentGateway.product_code;

        // const refundResponse = await fetch('https://uat.esewa.com.np/epay/main', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         transaction_uuid,
        //         total_amount,
        //         product_code
        //     }),
        // });

        // const data = await refundResponse.json();

        // if (data.status === 'success') {
        //     await Payment.updateOne(
        //         { _id: payment._id },
        //         {
        //             $set: {
        //                 refund: updatedRefund._id
        //             },
        //         }
        //     );
        // }

        //update Booking status
        const updateRoom = await Room.updateOne(
            { _id: updatedRefund.roomId },
            {
                $set: {
                    status: 'Available'
                },
            }
        );

       if(!updateRoom){
            throw new ApiError(500, 'Failed to update room');
        }
        //delete Booking
       
        const deleteBooking = await Booking.findByIdAndDelete(payment.booking);
        
        if(!deleteBooking){
            throw new ApiError(500, 'Failed to delete booking');
        }
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updateRefund,
                'Refund updated successfully'
            )
        )
});

const getRefundByUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const refund = await Refund.find({ userId });

    if (!refund) {
        throw new ApiError(500, 'Failed to get refund');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                refund,
                'Refund fetched successfully'
            )
        )
});

const getAllRefunds = asyncHandler(async (req, res) => {
    const refunds = await Refund.find();

    if (!refunds) {
        throw new ApiError(500, 'Failed to get refunds');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                refunds,
                'Refunds fetched successfully'
            )
        )
});

const rejectRefund = asyncHandler(async (req, res) => {
    const { ownerRejectionReason, status } = req.body;
    const refundId = req.params?.refundId;

    if (!isValidObjectId(refundId)) {
        throw new ApiError(400, 'Invalid refund id');
    }

    const ownerRejectionPhotosLocalFilesPath = req.files?.ownerRejectionPhotos?.map(file => file.path);

    if (!ownerRejectionPhotosLocalFilesPath || ownerRejectionPhotosLocalFilesPath.length === 0) {
        throw new ApiError(400, 'Owner rejection photos are required');
    }

    const ownerRejectionPhotosCloudinaryPath = await uploadMultipleFilesOnCloudinary(...ownerRejectionPhotosLocalFilesPath);

    if (!ownerRejectionPhotosCloudinaryPath || ownerRejectionPhotosCloudinaryPath.length === 0) {
        throw new ApiError(500, 'Failed to upload image');
    }

    const refund = await Refund.findById(refundId);
    const notificationReceiver = await User.findById(refund.userId);
    if (!refund) {
        throw new ApiError(500, 'Failed to get refund');
    }
    const room = await Room.findById(refund.roomId);

    if(room.owner.toString()!==req.user?._id.toString()){
        throw new ApiError(400,"Only Owner can Reject Refund Request")
    }

    const updatedRefund = await Refund.findOneAndUpdate(
        {
            _id: refund._id,
            $or: [
                { status: 'Pending' },
                { status: 'RejectedByOwner' }
            ]
        },
        {
            $set: {
                status,
                ownerRejectionReason,
                ownerRejectionPhotos: ownerRejectionPhotosCloudinaryPath
            }
        },
        {
            new: true
        }
    )

    if (!updatedRefund) {
        throw new ApiError(500, 'Failed to update refund');
        
    }

    await Notification.create({
        receiver: notificationReceiver._id,
        message: `Room refund request has been rejected by room owner`,
        refundId: refund._id,
        roomId: refund.roomId
    })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedRefund,
                'Refund rejected successfully'
            )
        )
});

const getRefundByStatus = asyncHandler(async (req, res) => {
    const status = req.params?.status;

    if (!status) {
        throw new ApiError(400, 'Status is required');
    }

    const refund = await Refund.find({ status });

    if (!refund) {
        throw new ApiError(500, 'Failed to get refund');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                refund,
                'Refund fetched successfully'
            )
        )
})

export {
    createRefund,
    updateRefund,
    getRefundByUser,
    getAllRefunds,
    rejectRefund,
    getRefundByStatus
};

