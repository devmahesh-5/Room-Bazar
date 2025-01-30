import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import RoommateRequest from "../models/roommateRequest.models.js";
import RoommateAccount from "../models/roommateAccount.models.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary from "../utils/Cloudinary.js";
import { isValidObjectId } from "mongoose";
const uploadMultipleFilesOnCloudinary = async (...args) => {
    const result = await Promise.all(args.map(async (arg) => await uploadOnCloudinary(arg)));
    return result;
}
const registerRoommate = asyncHandler(async (req, res) => {
    const { job, pets, smoking, haveRoom, description } = req.body;

    if ([job, pets, smoking, haveRoom, description].some((field) => !field || field.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingRoommate = await RoommateAccount.findOne({ userId: req.user?._id });

    if (existingRoommate) {
        throw new ApiError(400, 'Roommate already exists');
    }

    const roomPhotosLocalPath = req.files?.roomPhotos?.map((file) => file.path);

    if (!roomPhotosLocalPath || roomPhotosLocalPath.length === 0) {
        throw new ApiError(400, 'Room photos are required');
    }

    const roomPhotosCloudinaryPath = await uploadMultipleFilesOnCloudinary(roomPhotosLocalPath);

    const roomPhotosCloudinaryPathurls = roomPhotosCloudinaryPath.map((photo) => photo.url);

    if (!roomPhotosCloudinaryPath || roomPhotosCloudinaryPath.length === 0) {
        throw new ApiError(500, 'Failed to upload image');
    }

    const roommate = await RoommateAccount.create({
        userId: req.user?._id,
        job,
        pets,
        smoking,
        haveRoom,
        description,
        roomPhotos: roomPhotosCloudinaryPathurls
    })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                roommate,
                'Roommate registered successfully'
            )
        )
});
const updateRoommate = asyncHandler(async (req, res) => {
    const roommateId = req.params?.id;

    if (!isValidObjectId(roommateId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const { job, pets, smoking, haveRoom, description } = req.body;

    if ([job, pets, smoking, haveRoom, description].some((field) => !field || field.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    const updatedRoommate = await RoommateAccount.findByIdAndUpdate(roommateId,
        {
            $set: {
                job,
                pets,
                smoking,
                haveRoom,
                description
            }
        },
        { new: true }
    )

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedRoommate,
                'Roommate updated successfully'
            )
        )
});

const getRoommates = asyncHandler(async (req, res) => {
    const roommates = await RoommateAccount.find();

    if (!roommates) {
        throw new ApiError(404, 'Roommates not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                roommates,
                'Roommates fetched successfully'
            )
        )

});

const getRoommateById = asyncHandler(async (req, res) => {
    const roommateId = req.params?.id;

    if (!isValidObjectId(roommateId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const roommate = await RoommateAccount.findById(roommateId);

    if (!roommate) {
        throw new ApiError(404, 'Roommate not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                roommate,
                'Roommate fetched successfully'
            )
        )
});

const deleteRoommateAccount = asyncHandler(async (req, res) => {
    const roommateId = req.params?.id;

    if (!isValidObjectId(roommateId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const deletedRoommateAccount = await RoommateAccount.findById(roommateId);

    if (!deletedRoommateAccount) {
        throw new ApiError(500, "Failed to delete account");
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedRoommateAccount,
                'Roommate account deleted successfully'
            )
        )
});

const searchRoomates = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, } = req.query;

    const searchQuery = {
        $or: [
            { 'user.fullName': { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ]
    }

    const roommates = await RoommateAccount.aggregate(
        [
            { $match: searchQuery },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
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
                    user: { $arrayElemAt: ['$user', 0] }
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (page - 1) * limit
            },
            {
                $limit: limit
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    job: 1,
                    pets: 1,
                    smoking: 1,
                    haveRoom: 1,
                    description: 1
                }
            }

        ]
    )

    if (!roommates) {
        throw new ApiError(404, 'Roommates not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                roommates,
                'Roommates fetched successfully'
            )
        )
});

const getRoommateByJob = asyncHandler(async (req, res) => {
    const job = req.params?.job;

    const roommates = await RoommateAccount.find({ job });

    if (!roommates) {
        throw new ApiError(404, 'Roommates not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                roommates,
                'Roommates fetched successfully'
            )
        )
});

const sendRoommateRequest = asyncHandler(async (req, res) => {
    //Algorithm
    //get user id from token
    //get roommate id from params
    //check if user id is valid
    //check if roommate id is valid
    //check if user is already a roommate
    //check if roommate is already a user
    //check if user is already a roommate request
    //check if roommate is already a roommate request
    //create roommate request

    const existingRequest = await RoommateRequest.findOne({
        $or: [
            { sender: req.user?._id, receiver: req.params?.id },
            { sender: req.params?.id, receiver: req.user?._id }
        ]
    })

    if (existingRequest) {
        throw new ApiError(400, 'Roommate request already exists');
    }

    const roommateRequest = await RoommateRequest.create({
        sender: req.user?._id,
        receiver: req.params?.id,
        status: 'Pending'
    })

    if (!roommateRequest) {
        throw new ApiError(500, "Failed to send request");
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                roommateRequest,
                'Roommate request sent successfully'
            )
        )
});

const acceptRoommateRequest = asyncHandler(async (req, res) => {
    //Algorithm
    //get user id from token(receiver)
    //get roommate id from params(sender)
    //check if user id is valid

    const acceptedRoommateRequest = await RoommateRequest.findOneAndUpdate(
        {
            receiver: req.user?._id,
            sender: req.params?.id
        },
        {
            $set: {
                status: 'Accepted'
            }
        },
        { new: true }
    )

    if (!acceptedRoommateRequest) {
        throw new ApiError(500, "Failed to accept request");
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                acceptedRoommateRequest,
                'Roommate request accepted successfully'
            )
        )
});
const rejectRoommateRequest = asyncHandler(async (req, res) => {
    const receiver = req.user?._id;
    const sender = req.params?.id;

    if(!isValidObjectId(receiver) || !isValidObjectId(sender)){
        throw new ApiError(400, 'Invalid user id');
    }

    const rejectedRoommateRequest = await RoommateRequest.findOneAndUpdate(
        {
            receiver,
            sender
        },
        {
            $set: {
                status: 'Rejected'
            }
        }
    )

    if(!rejectedRoommateRequest){
        throw new ApiError(500, "Failed to reject request");
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                rejectedRoommateRequest,
                'Roommate request rejected successfully'
            )
        )

});

const cancelRoommateRequest = asyncHandler(async (req, res) => {
    const sender = req.user?._id;
    const receiver = req.params?.id;

    if(!isValidObjectId(sender) || !isValidObjectId(receiver)){
        throw new ApiError(400, 'Invalid user id');
    }

    const cancelledRoommateRequest = await RoommateRequest.findOneAndDelete(
        {
            receiver,
            sender
        }
    )

    if(!cancelledRoommateRequest){
        throw new ApiError(500, "Failed to cancel request");
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                cancelledRoommateRequest,
                'Roommate request cancelled successfully'
            )
        )
});

export {
    registerRoommate,
    updateRoommate,
    getRoommates,
    getRoommateById,
    deleteRoommateAccount,
    searchRoomates,
    getRoommateByJob,
    sendRoommateRequest,
    acceptRoommateRequest,
    rejectRoommateRequest,
    cancelRoommateRequest
}
//for message use roommate id not user id 