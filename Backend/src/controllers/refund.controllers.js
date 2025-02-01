import Refund from "../models/refund.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import { isValidObjectId } from "mongoose";
import {uploadMultipleFilesOnCloudinary} from "../utils/Cloudinary.js";

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

    const amount = await Room.findById(roomId)?.price;
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
    // const userId = req.params?.id;
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
    const { ownerRejectReason } = req.body;
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

    if (!refund) {
        throw new ApiError(500, 'Failed to get refund');
    }

    refund.ownerRejectionReason = ownerRejectReason;
    refund.ownerRejectionPhotos = ownerRejectionPhotosCloudinaryPath;
    refund.status = 'RejectedByOwner';

    await refund.save({ validateBeforeSave: false });
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

