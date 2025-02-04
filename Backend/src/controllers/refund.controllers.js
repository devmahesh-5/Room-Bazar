import Refund from "../models/refund.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import { isValidObjectId } from "mongoose";
import {uploadMultipleFilesOnCloudinary} from "../utils/Cloudinary.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
const createRefund = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const roomId = req.params?.id;
    const userId = req.user?._id;

    if (!isValidObjectId(userId) || !isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid user id or room id');
    }

    if (!reason || reason.trim() === '') {
        throw new ApiError(400, 'Reason is required');
    }

    const amount = (await Room.findById(roomId)?.price)*0.9;
    if (!amount) {
        throw new ApiError(500, 'Failed to get room price');
    }
    const refund = await Refund.create({
        userId,
        roomId,
        status: 'Pending',
        reason,
        amount
    })

    if (!refund) {
        throw new ApiError(500, 'Failed to create refund');
    }

    const user = await User.findById(userId);
    const room = await Room.findById(roomId);

    await Notification.create({
        receiver:[user._id,room.owner],
        message : `Room ${room.title} has been requested for Refund by ${user.fullName}`,
        refundId : refund._id,
        roomId : room._id
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
     const userId = req.params?.id;
    const refundId = req.params?.refundId;
    const { status } = req.body;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const refund = await Refund.findOne({ _id: refundId });

    if (!refund) {
        throw new ApiError(500, 'Failed to get refund');
    }

    refund.status = status;
    refund.save({ validateBeforeSave: false });

    if (status === 'Approved') {
        await Notification.create({
            receiver : refund.userId,
            message : `Room refund request has been approved.you will get refund soon`,
            refundId : refund._id,
            roomId : refund.roomId
        })
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                refund,
                'Refund updated successfully'
            )
        )
});

const getRefundByUser = asyncHandler(async (req, res) => {
    const userId = req.params?.id;

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
    const { ownerRejectReason,status } = req.body;
    const refundId = req.params?.id;

    if (!isValidObjectId(refundId)) {
        throw new ApiError(400, 'Invalid refund id');
    }

const ownerRejectionPhotosLocalFilesPath = req.files?.ownerRejectionPhotos?.map(file => file.path);

    if (!ownerRejectionPhotosLocalFilesPath || ownerRejectionPhotosLocalFilesPath.length === 0) {
        throw new ApiError(400, 'Owner rejection photos are required');
    }

    const ownerRejectionPhotosCloudinaryPath = await uploadMultipleFilesOnCloudinary(ownerRejectionPhotosLocalFilesPath);

    if (!ownerRejectionPhotosCloudinaryPath || ownerRejectionPhotosCloudinaryPath.length === 0) {
        throw new ApiError(500, 'Failed to upload image');
    }

    const refund = await Refund.findById(refundId);
    const notificationReceiver = await User.findById(refund.userId);
    if (!refund) {
        throw new ApiError(500, 'Failed to get refund');
    }

    refund.ownerRejectionReason = ownerRejectReason;
    refund.ownerRejectionPhotos = ownerRejectionPhotosCloudinaryPath;
    refund.status = status;

    await refund.save({ validateBeforeSave: false });

    await Notification.create({
        receiver: notificationReceiver._id,
        message : `Room refund request has been rejected by room owner`,
        refundId : refund._id,
        roomId : refund.roomId
    })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                refund,
                'Refund rejected successfully'
            )
        )
});

const getRefundByStatus = asyncHandler(async (req, res) => {
    const status = req.body?.status;

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

export { createRefund, updateRefund, getRefundByUser, getAllRefunds, rejectRefund, getRefundByStatus };

