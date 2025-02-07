import mongoose from "mongoose";
import Report from "../models/report.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";

const addRoomReport = asyncHandler(async (req, res) => {
    const { reason } = req.body;

    if (!reason || reason.trim() === '') {
        throw new ApiError(400, 'Reason is required');
    }

    const userId = req.user?._id;
    const roomId = req.params?.roomId;

    if (!isValidObjectId(userId) || !isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid user id or room id');
    }

    const report = await Report.create({
        reporter: userId,
        roomId,
        reason,
    })

    if (!report) {
        throw new ApiError(500, 'Failed to add report');
    }

    const notification = await Notification.create({
        receiver: [req.user?._id],
        message: 'Thank you for reporting this room.we will take appropriate action',
        roomId: roomId,
        reportId: report._id
    });

    if (!notification) {
        throw new ApiError(500, 'Failed to create notification');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                report,
                'Report added successfully'
            )
        )

});

const addOwnerReport = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const userId = req.user?._id;
    const ownerId = req.params?.ownerId;

    if (!reason || reason.trim() === '') {
        throw new ApiError(400, 'Reason is required');
    }

    if (!isValidObjectId(userId) || !isValidObjectId(ownerId)) {
        throw new ApiError(400, 'Invalid user id or owner id');
    }

    const report = await Report.create({
        reporter: userId,
        roomOwner: ownerId,
        reason,
    })

    if (!report) {
        throw new ApiError(500, 'Failed to add report');
    }
    const owner = await User.findById(ownerId);
    if (!owner) {
        throw new ApiError(500, 'Owner not found');
    }
    const notification = await Notification.create({
        receiver: req.user?._id,
        message: `Thank you for reporting ${owner.fullName}.we will take appropriate action`,
        reportId: report._id,
    });

    if (!notification) {
        throw new ApiError(500, 'Failed to create notification');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                report,
                'Report added successfully'
            )
        )

});

const getAllReports = asyncHandler(async (req, res) => {
    const reports = await Report.find();

    if (!reports) {
        throw new ApiError(500, 'Failed to get reports');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                reports,
                'Reports fetched successfully'
            )
        )
});

const getRoomReport = asyncHandler(async (req, res) => {
    const roomId = req.params?.roomId;

    if (!isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const reports = await Report.aggregate([
            {
                $match: {
                    roomId: new mongoose.Types.ObjectId(roomId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'reporter',
                    foreignField: '_id',
                    as: 'reporter',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                fullName: 1,
                                email: 1,
                                phone: 1,
                                address: 1
                            }
                        },
                    ]
                }
            },
            {
                $addFields: {
                    reporter: { $arrayElemAt: ['$reporter', 0] }
                }
            }
    ])

    if (!reports) {
        throw new ApiError(500, 'Failed to get reports');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                reports,
                'Reports fetched successfully'
            )
        )
});

const getOwnerReport = asyncHandler(async (req, res) => {
    const ownerId = req.params?.ownerId;

    if (!isValidObjectId(ownerId)) {
        throw new ApiError(400, 'Invalid owner id');
    }

    const reports = await Report.find({
        roomOwner: ownerId
    })

    if (!reports) {
        throw new ApiError(500, 'Failed to get reports');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                reports,
                'Reports fetched successfully'
            )
        )
});

export {
    addRoomReport,
    addOwnerReport,
    getAllReports,
    getRoomReport,
    getOwnerReport
};