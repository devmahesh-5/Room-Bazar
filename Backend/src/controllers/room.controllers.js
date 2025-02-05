import mongoose from "mongoose";
import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import  Location  from "../models/location.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary,{ uploadMultipleFilesOnCloudinary, deleteImageFromCloudinary } from "../utils/Cloudinary.js";

const createRoom = asyncHandler(async (req, res) => {
    const { title, description, capacity, price, category, status, totalRooms,esewaId } = req.body;

    if ([title, description, capacity, price, category, status, totalRooms,esewaId].some((field) => !field || field.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'Room thumbnail is required');
    }
    const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath);

    const roomPhotosLocalPath = req.files?.roomPhotos?.map((file) => file.path);

    if (!roomPhotosLocalPath || roomPhotosLocalPath.length === 0) {
        throw new ApiError(400, 'Room photos are required');
    }

    let roomPhotosCloudinaryPath = await uploadMultipleFilesOnCloudinary(roomPhotosLocalPath);

    // roomPhotosCloudinaryPath = roomPhotosCloudinaryPath.map((photo) => photo.url);

    if (!roomPhotosCloudinaryPath || roomPhotosCloudinaryPath.length === 0) {
        throw new ApiError(500, 'Failed to upload image');
    }
    const room = await Room.create({
        title,
        description,
        capacity,
        price,
        category,
        status,
        totalRooms,
        roomPhotos: roomPhotosCloudinaryPath,
        thumbnail: thumbnailCloudinaryPath.url,
        esewaId,
        owner : req.user._id,
    })

    if (!room) {
        throw new ApiError(500, 'Failed to create room');
    }

    const location = await Location.create({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        roomid : room._id
    })
    
    if(!location){
        throw new ApiError(500, 'Failed to add location');
    }
    
    await Notification.create({
        receiver : room.owner,
        message : `Room ${room.title} has been Listed`,
        roomid : room._id
    })

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Room created successfully',
                data: room
            })
        )

});

const updateRoom = asyncHandler(async (req, res) => {
    const roomDetails = req.body;
    //user pass empty fields do not change that specific field
    Object.keys(roomDetails).forEach((key) => {
        if (!roomDetails[key]) {
            delete roomDetails[key];
        }
    })
    const thumbnailLocalPath = req.file?.path;
    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'Room thumbnail is required');
    }
    const oldRoom = await Room.findById(req.params?.id);

    
    const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath);

    if(oldRoom){
        const oldRoomThumbnail = oldRoom.thumbnail;
        if(oldRoomThumbnail){
            const oldRoomThumbnailPublicId = oldRoomThumbnail.split('/').pop().split('.')[0];
            await deleteImageFromCloudinary(oldRoomThumbnailPublicId);
        }
    }else{
        console.warn("Could not delete old room thumbnail");
    }
    if (!thumbnailCloudinaryPath) {
        throw new ApiError(500, 'Failed to upload image');
    }

    

    const updatedRoom = await Room.findByIdAndUpdate(req.params?.id, {
        $set: {...roomDetails, thumbnail: thumbnailCloudinaryPath.url}
    }, { new: true })

    if (!updatedRoom) {
        throw new ApiError(500, 'Failed to update room');
    }

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Room updated successfully',
                data: updatedRoom
            })
        )

});

const deleteRoom = asyncHandler(async (req, res) => {
    const roomId = req.params?.id;
    const userId = req.user?._id;

    if (!isValidObjectId(roomId) || !isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id or user id');
    }

    const deletedRoom = await Room.findOneAndDelete(
        {
            _id: roomId,
            owner: userId
        }
    )

    if (!deletedRoom) {
        throw new ApiError(500, 'Failed to delete room');
    }

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Room deleted successfully',
                data: deletedRoom
            })
        )

});

const getRoomById = asyncHandler(async (req, res) => {
    const roomId = req.params?.id;

    if (!isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const room = await Room.findById(roomId);

    if (!room) {
        throw new ApiError(404, 'Room not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Room fetched successfully',
                data: room
            })
        )

});

const getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.find();

    if (!rooms) {
        throw new ApiError(404, 'Rooms not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Rooms fetched successfully',
                data: rooms
            })
        )

});

const searchRooms = asyncHandler(async (req, res) => {

    const { page = 1, limit = 10, query, } = req.query;

    const searchQuery = {
        $or: [
            { title: { $regex: query, $options: 'i' } },
            { description: { $regex: query, $options: 'i' } },
        ]
    }

    const rooms = await Room.aggregate(
        [
            {
                $match: searchQuery
            },
            {
                $lookup:{
                    from:'users',
                    localField:'owner',
                    foreignField:'_id',
                    as:'owner',
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
                    owner: { $arrayElemAt: ['$owner', 0] }
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
                    title: 1,
                    description: 1,
                    capacity: 1,
                    price: 1,
                    category: 1,
                    status: 1,
                    totalRooms: 1,
                    owner: 1,
                    roomPhotos: 1
                }
            }
        ]
    )

    if (!rooms) {
        throw new ApiError(404, 'Rooms not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Rooms fetched successfully',
                data: rooms
            })
        )
});

const getRoomsByCategory = asyncHandler(async (req, res) => {
    const category = req.params?.category;
    if(!category){
        throw new ApiError(400, 'Category is required');
    }

    const rooms = await Room.aggregate(
        [
            {
                $match: {
                    category: category
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
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
                    owner: { $arrayElemAt: ['$owner', 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    capacity: 1,
                    price: 1,
                    category: 1,
                    status: 1,
                    totalRooms: 1,
                    owner: 1,
                    roomPhotos: 1,
                    thumbnail: 1,
                    location: 1
                }
            }
        ]
    )

    if (!rooms) {
        throw new ApiError(404, 'Rooms not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Rooms fetched successfully',
                data: rooms
            })
        )
});

const getRoomsByLocation = asyncHandler(async (req, res) => {
    const location = req.params?.location;
    if(!location){
        throw new ApiError(400, 'Location is required');
    }

    const rooms = await Room.aggregate(
        [
            {
                $match: {
                    location: location
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'owner',
                    foreignField: '_id',
                    as: 'owner',
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
                    owner: { $arrayElemAt: ['$owner', 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    capacity: 1,
                    price: 1,
                    category: 1,
                    status: 1,
                    totalRooms: 1,
                    owner: 1,
                    thumbnail: 1
                }
            }
        ]
    )

    if (!rooms) {    
        throw new ApiError(404, 'Rooms not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse({
                message: 'Rooms fetched successfully',
                data: rooms
            })
    )
});

export {
    createRoom,
    getRoomById,
    updateRoom,
    deleteRoom,
    getAllRooms,
    searchRooms,
    getRoomsByCategory,
    getRoomsByLocation
}