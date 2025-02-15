import mongoose from "mongoose";
import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import RoommateRequest from "../models/roommateRequest.models.js";
import RoommateAccount from "../models/roommateAccount.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import { uploadMultipleFilesOnCloudinary } from "../utils/Cloudinary.js";
import Location from "../models/location.models.js";
import { getRoommateByUserId } from "../constants.js";

const registerRoommate = asyncHandler(async (req, res) => {
    const {job, pets, smoking, haveRoom, description,address,latitude,longitude} = req.body;
    // console.log(req.body);
    
    if ([job, pets, smoking, haveRoom, description,address].some((field) => !field || !field.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingRoommate = await RoommateAccount.findOne({ userId: req.user?._id });

    if (existingRoommate) {
        throw new ApiError(400, 'Roommate already exists');
    }

    const roomPhotosLocalPath = req.files?.roomPhotos?.map((file) => file.path);

    // if (!roomPhotosLocalPath || roomPhotosLocalPath.length === 0) {
    //     throw new ApiError(400, 'Room photos are required');
    // }

    let roomPhotosCloudinaryPath;

    if (roomPhotosLocalPath && roomPhotosLocalPath.length > 0) {

        roomPhotosCloudinaryPath = await uploadMultipleFilesOnCloudinary(...roomPhotosLocalPath);
    
        // const roomPhotosCloudinaryPathurls = roomPhotosCloudinaryPath.map((photo) => photo.url);
    
        if (!roomPhotosCloudinaryPath || roomPhotosCloudinaryPath.length === 0) {
            throw new ApiError(500, 'Failed to upload image');
        }
    }
    
    const roommate = await RoommateAccount.create({
        userId: req.user?._id,
        job,
        pets,
        smoking,
        haveRoom,
        description,
        roomPhotos: roomPhotosCloudinaryPath
    })
    const location = await Location.create({
        latitude,
        longitude,
        address,
        roommate : roommate._id
    })
    if(!Location){
        throw new ApiError(500, 'Failed to add location');
    }
    const updatedRoommate = await RoommateAccount.findByIdAndUpdate(roommate._id,
        {
            $set: {
                location: location._id
            }
        },
        { new: true }
    )

    if(!updatedRoommate){
        throw new ApiError(500, 'Failed to add location');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedRoommate,
                'Roommate registered successfully'
            )
        )
});

const updateRoommate = asyncHandler(async (req, res) => {
    const userId = req.user?._id;  

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const { job, pets, smoking, haveRoom, description,address,latitude,longitude } = req.body;

    if ([job, pets, smoking, haveRoom, description,address].some((field) => !field || field.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }

    const roommate = await RoommateAccount.findOne({ userId });

    if (!roommate) {
        throw new ApiError(404, 'Roommate not found');
    }
    const updatedLocation = await Location.findOneAndUpdate(
        { roommate: roommate._id },
        {
            $set: {
                address,
                latitude,
                longitude
            }
        },
    )
    const updatedRoommate = await RoommateAccount.findOneAndUpdate(
        { userId },
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

    if (!updatedRoommate) {
        throw new ApiError(500, 'Failed to update roommate');
    }

    if(!updatedLocation){
        throw new ApiError(500, 'Failed to update location');
    }

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
    const roommates = await RoommateAccount.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'user',
                pipeline: [
                    {
                        $project: {
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },{
            $addFields: {
                user: { $arrayElemAt: ['$user', 0] }
            }
        },
        {
            $lookup :{
                from : 'locations',
                localField : '_id',
                foreignField : 'roommate',
                as : 'location',
                pipeline: [
                    {
                        $project: {
                            latitude: 1,
                            longitude: 1,
                            address: 1
                        
                }}]
            }
        },
        {
            $addFields: {
                location: { $arrayElemAt: ['$location', 0] }
            }
        },
        {
            $project: {
                _id: 1,
                user: 1,
                job: 1,
                pets: 1,
                smoking: 1,
                haveRoom: 1,
                description: 1,
                roomPhotos: 1,
                location: 1
            }
        }
    ]);

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
    const roommateId = req.params?.roommateId;

    if (!isValidObjectId(roommateId)) {
        throw new ApiError(400, 'Invalid roommate id');
    }

    // console.log(roommateId);
    
    const roommate = await RoommateAccount.aggregate(
        [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(roommateId)
                }
            },
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
                $lookup:{
                    from : 'locations',
                    localField : '_id',
                    foreignField : 'roommate',
                    as : 'location',
                    pipeline: [
                        {
                            $project: {
                                latitude: 1,
                                longitude: 1,
                                address: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] },
                    location: { $arrayElemAt: ['$location', 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    job: 1,
                    pets: 1,
                    smoking: 1,
                    haveRoom: 1,
                    description: 1,
                    roomPhotos: 1,
                    location: 1
                }
            }
        ]
    );

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

const getMyRoommates = asyncHandler(async(req, res) => {
    const userId = req.user._id;
    const myRoommateAccount = await getRoommateByUserId(userId);
    if(!myRoommateAccount){
        throw new ApiError(404, 'Roommate not found');
    }

    const myRoommates = await RoommateRequest.aggregate(
        [
            {
                $match:{
                   $or:[
                        {sender:myRoommateAccount._id},
                        {receiver:myRoommateAccount._id}
                    ],
                    status:'Accepted'
                }
                
                },
            {
                $lookup: {
                    from : 'roommateaccounts',
                    localField : 'sender',
                    foreignField : '_id',
                    as : 'sender',
                    pipeline: [
                        {
                            $lookup:{
                                from : 'users',
                                localField : 'userId',
                                foreignField : '_id',
                                as : 'user',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            fullName: 1,
                                            email: 1,
                                            phone: 1,
                                            address: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                user:{$arrayElemAt:['$user',0]}
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                user: 1,
                                job: 1,
                                smoking: 1,
                                pets: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from : 'roommateaccounts',
                    localField : 'receiver',
                    foreignField : '_id',
                    as : 'receiver',
                    pipeline: [
                        {
                            $lookup:{
                                from : 'users',
                                localField : 'userId',
                                foreignField : '_id',
                                as : 'user',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            fullName: 1,
                                            email: 1,
                                            phone: 1,
                                            address: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                user:{$arrayElemAt:['$user',0]}
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                user: 1,
                                job: 1,
                                smoking: 1,
                                pets: 1,
                        }
                        }
                    ]
                }         
            },
            {
                $project:{
                    myRoommates:{
                        $cond: {
                            if: { $eq: ["$sender._id", myRoommateAccount._id] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    }
                }
            }
        ]
    )

    if(!myRoommates){
        throw new ApiError(404, 'Roommates not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                myRoommates,
                'Roommates fetched successfully'
            )
        )
})

const deleteRoommateAccount = asyncHandler(async (req, res) => {
    const userId = req.user?.id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id');
    }
    const roommateAccount = await getRoommateByUserId(userId);
    
    if(!roommateAccount){
        throw new ApiError(404, 'Roommate not found');
    }

    const roommateRequest = await RoommateRequest.findOneAndDelete({
        $or: [
            { sender: roommateAccount._id },
            { receiver: roommateAccount._id }
        ]
    })

    const deletedRoommateAccount = await RoommateAccount.findByIdAndDelete(roommateAccount._id);

    const deletedLocation = await Location.findOneAndDelete({roommate: deletedRoommateAccount._id});

    if (!deletedRoommateAccount) {
        throw new ApiError(500, "Failed to delete account");
    }

    if(!deletedLocation){
        throw new ApiError(500, "Failed to delete location");
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
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: 'roommate',
                    as: 'location'
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] },
                    location: { $arrayElemAt: ['$location', 0] }
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
                    description: 1,
                    location: 1
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
    const {job} = req.body;
    
    const roommates = await RoommateAccount.aggregate(
        [
            {
                $match: {
                    job: job
                }
            },
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
                $project: {
                    _id: 1,
                    user: 1,
                    job: 1,
                    pets: 1,
                    smoking: 1,
                    haveRoom: 1
                }
            }
        ]
    );

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


//request actions

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
    const userId = req.user?._id;
    const roommate = await getRoommateByUserId(userId);
    if(!roommate){
        throw new ApiError(404, 'Roommate not found');
    }
    
    const existingRequest = await RoommateRequest.findOne({
        $or: [
            { sender: roommate._id, receiver: req.params?.roommateId },
            { sender: req.params?.roommateId, receiver: roommate._id }
        ]
    })

    if(roommate._id.toString()===req.params?.roommateId){
        throw new ApiError(400, 'You cannot send a request to yourself');
    }

    if (existingRequest) {
        throw new ApiError(400, 'Roommate request already exists');
    }

    const roommateRequest = await RoommateRequest.create({
        sender: roommate._id,
        receiver: req.params?.roommateId,
        status: 'Pending'
    })

    if (!roommateRequest) {
        throw new ApiError(500, "Failed to send request");
    }
    const notificationReceiverRoommate = await RoommateAccount.findById(req.params?.roommateId);
    const notificationReceiverUser = notificationReceiverRoommate.userId;
    await Notification.create({
        receiver: notificationReceiverUser,
        message: `${roommate.user.fullName} sent you a Roommate request`,
        roommateId: roommate._id
    })

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
    const userId = req.user?._id;
    const myRoommateAccount = await getRoommateByUserId(userId);
    const acceptedRoommateRequest = await RoommateRequest.findOneAndUpdate(
        {
            receiver: myRoommateAccount._id,
            sender: req.params?.roommateId,
            status: 'Pending'

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
    const notificationReceiverRoommate = await RoommateAccount.findById(req.params?.roommateId);
    const notificationReceiverUser = notificationReceiverRoommate.userId;
    await Notification.create(
        {
            receiver: notificationReceiverUser,
            message: `${myRoommateAccount.user.fullName} accepted your Roommate request`,
            roommateId: myRoommateAccount._id
        }
    )

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
    const user = req.user?._id;
    const sender = req.params?.roommateId;
    
    const myRoommateAccount = await getRoommateByUserId(user);

    const receiver = myRoommateAccount._id;

    if (!isValidObjectId(user) || !isValidObjectId(sender)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const rejectedRoommateRequest = await RoommateRequest.findOneAndUpdate(
        {
            receiver,
            sender,
            status: 'Pending'
        },
        {
            $set: {
                status: 'Rejected'
            }
        },
        {
            new: true
        }
    )

    if (!rejectedRoommateRequest) {
        throw new ApiError(500, "Failed to reject request");
    }
    const notificationReceiverRoommate = await RoommateAccount.findById(sender);
    const notificationReceiverUser = notificationReceiverRoommate.userId;
    await Notification.create(
        {
            receiver: notificationReceiverUser,
            message: `${myRoommateAccount.user.fullName} rejected your Roommate request`,
            roommateId: receiver
        }
    )

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
    const user = req.user?._id;
    const receiver= req.params?.roommateId;
    if(!isValidObjectId(user) || !isValidObjectId(receiver)){
        throw new ApiError(400, 'Invalid user id');
    }
    const myRoommateAccount = await getRoommateByUserId(user);
    
    const cancelledRoommateRequest = await RoommateRequest.findOneAndDelete(
        {
         sender: myRoommateAccount._id, 
         receiver,
         status: 'Pending'
        }
    )

    if (!cancelledRoommateRequest) {
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

const getSentRoommateRequest = asyncHandler(async (req, res) => {
    const user = req.user?._id;

    if (!isValidObjectId(user)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const myRoommateAccount = await getRoommateByUserId(user);

    const sentRequest = await RoommateRequest.aggregate([
        {
            $match: {
                sender: myRoommateAccount._id,
                status: 'Pending'
            }
        },
        {
            $group:{
                _id:sender,
                receiver:{$addToSet:receiver},
            }
        },
        {
            $lookup: {
                from: 'roommateaccounts',
                localField: 'receiver',
                foreignField: '_id',
                as: 'receiver',
                pipeline: [
                    {
                        $lookup:{
                            from : 'users',
                            localField : 'userId',
                            foreignField : '_id',
                            as : 'user',
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            user:{$arrayElemAt:['$user',0]}
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                receiver: 1
            }
        }
        
    ])

    if (!sentRequest) {
        throw new ApiError(404, 'Roommates not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                sentRequest,
                'Roommates found successfully'
            )
        )
});

const getReceivedRoommateRequest = asyncHandler(async (req, res) => {
    const user = req.user?._id;

    if (!isValidObjectId(user)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const myRoommateAccount = await getRoommateByUserId(user);

    if(!myRoommateAccount){
        throw new ApiError(404, 'Roommate not found');
    }

    const receivedRequest = await RoommateRequest.aggregate([
        {
            $match: {
                receiver: myRoommateAccount._id,
                status: 'Pending'
            }
        },
        {
            $group:{
                _id:receiver,
                sender:{$addToSet:sender},
            }
        },
        {
            $lookup: {
                from: 'roommateaccounts',
                localField: 'sender',
                foreignField: '_id',
                as: 'sender',
                pipeline: [
                    {
                        $lookup:{
                            from : 'users',
                            localField : 'userId',
                            foreignField : '_id',
                            as : 'user',
                            pipeline: [
                                {
                                    $project: {
                                        _id: 1,
                                        fullName: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            user:{$arrayElemAt:['$user',0]}
                        }
                    }
                ]
            }
        },
        {
            $project: {
                _id: 1,
                sender: 1
            }
        }
    ])

    if (!receivedRequest) {
        throw new ApiError(404, 'Roommates not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                receivedRequest,
                'Roommates found successfully'
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
    getMyRoommates,
    sendRoommateRequest,
    acceptRoommateRequest,
    rejectRoommateRequest,
    cancelRoommateRequest,
    getSentRoommateRequest,
    getReceivedRoommateRequest
}
