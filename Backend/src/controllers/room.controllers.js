import mongoose,{ isValidObjectId } from "mongoose";
import Room from "../models/room.models.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import Location from "../models/location.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import uploadOnCloudinary, { uploadMultipleFilesOnCloudinary, deleteImageFromCloudinary } from "../utils/Cloudinary.js";
const createRoom = asyncHandler(async (req, res) => {
    
    const { title, description, capacity, price, category, status, totalRooms, esewaId,khaltiId, rentPerMonth} = req.body;

    if ([title, description, capacity, price, category, status, totalRooms, rentPerMonth].some((field) => !field || field.trim() === '')) {
        throw new ApiError(400, 'All fields are required');
    }
    if(!esewaId && !khaltiId){
        throw new ApiError(400, 'atleast one payment method is required');
    }
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
    
    if (!thumbnailLocalPath) {
        throw new ApiError(400, 'Room thumbnail is required');
    }
    const thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath);

    const roomPhotosLocalPath = req.files?.roomPhotos?.map((file) => file.path);
    // console.log(roomPhotosLocalPath);

    if (!roomPhotosLocalPath || roomPhotosLocalPath.length === 0) {
        throw new ApiError(400, 'Room photos are required');
    }

    const roomPhotosCloudinaryPath = await uploadMultipleFilesOnCloudinary(...roomPhotosLocalPath);

    const videoLocalPath = req.files?.video[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, 'Room video is required');
    }

    const videoCloudinaryPath = await uploadOnCloudinary(videoLocalPath);
    
    if (!videoCloudinaryPath) {
        throw new ApiError(500, 'Room video upload failed');
    }

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
        thumbnail: thumbnailCloudinaryPath.secure_url || thumbnailCloudinaryPath.url,
        esewaId,
        khaltiId,
        owner: req.user._id,
        rentPerMonth,
        video: videoCloudinaryPath.secure_url || videoCloudinaryPath.url
    })

    if (!room) {
        throw new ApiError(500, 'Failed to create room');
    }

    const location = await Location.create({
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address: req.body.address,
        roomid: room._id,
        roomOwner: room.owner
    })

    if (!location) {
        throw new ApiError(500, 'Failed to add location');
    }

    await Room.findByIdAndUpdate(room._id, {
        $set: {
            location: location._id
        }
    }, { new: true })


    await Notification.create({
        receiver: room.owner,
        message: `Room ${room.title} has been Listed`,
        roomid: room._id
    })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                room,
                'Room created successfully'
            )
        )

});

const updateRoom = asyncHandler(async (req, res) => {
    const roomDetails = req.body;
    // const address = roomDetails?.location?.address;
    delete roomDetails?.location;
    delete roomDetails?.owner;
    delete roomDetails?.esewaId;
    delete roomDetails?.khaltiId;
    //user pass empty fields do not change that specific field
    Object.keys(roomDetails).forEach((key) => {
        if (!roomDetails[key]) {
            delete roomDetails[key];
        }
    })

    if (!isValidObjectId(req.params?.roomId)) {
        throw new ApiError(400, 'Invalid room id');
    }
    
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

    const roomPhotosLocalPath = req.files?.roomPhotos?.map((file) => file?.path);
    // if (!roomPhotosLocalPath || roomPhotosLocalPath?.length === 0) {
    //     throw new ApiError(400, 'Room photos are required');
    // }
    
    const oldRoom = await Room.findById(req.params?.roomId);
    
    let roomPhotosCloudinaryPath;
    if(roomPhotosLocalPath && roomPhotosLocalPath.length > 0){
        roomPhotosCloudinaryPath = await uploadMultipleFilesOnCloudinary(...roomPhotosLocalPath);
        if (!roomPhotosCloudinaryPath || roomPhotosCloudinaryPath.length === 0) {
            throw new ApiError(500, 'Failed to upload image');
        }
        oldRoom.roomPhotos = roomPhotosCloudinaryPath;
        oldRoom.save({ validateBeforeSave: false });
    }


    let thumbnailCloudinaryPath;

    if (thumbnailLocalPath) {
        thumbnailCloudinaryPath = await uploadOnCloudinary(thumbnailLocalPath);
        thumbnailCloudinaryPath = thumbnailCloudinaryPath?.secure_url || thumbnailCloudinaryPath?.url;
        if (!thumbnailCloudinaryPath) {
            throw new ApiError(500, 'Failed to upload image');
        }else{
            oldRoom.thumbnail = thumbnailCloudinaryPath;
            oldRoom.save({ validateBeforeSave: false });
        }
    }


    const updatedRoom = await Room.findByIdAndUpdate(req.params?.roomId, {
        $set: { ...roomDetails }
    }, { new: true })

    if (!updatedRoom) {
        throw new ApiError(500, 'Failed to update room');
    }

    // if (oldRoom) {
    //     const oldRoomThumbnail = oldRoom.thumbnail;
    //     if (oldRoomThumbnail) {
    //         const oldRoomThumbnailPublicId = oldRoomThumbnail.split('/').pop().split('.')[0];
    //         await deleteImageFromCloudinary(oldRoomThumbnailPublicId);
    //         const oldRoomPhotos = oldRoom.roomPhotos;
    //         if (oldRoomPhotos) {
    //             try {
    //                 const oldRoomPhotosPublicIds = oldRoomPhotos.map((photo) => photo.split('/').pop().split('.')[0]);

    //                 await Promise.all(
    //                     oldRoomPhotosPublicIds.map(async (publicid) => {
    //                         await deleteImageFromCloudinary(publicid);
    //                     })
    //                 );
    //             } catch (error) {
    //                 throw new ApiError(500, 'Failed to delete old room photos');
    //             }
    //         }
    //     }
    // } else {
    //     console.warn("Could not delete old room thumbnail");
    // }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedRoom,
                'Room updated successfully'
            )
        )

});

const deleteRoom = asyncHandler(async (req, res) => {
    const roomId = req.params?.roomId;
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
    const roomId = req.params?.roomId;

    if (!isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const room = await Room.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(roomId)
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
                            fullName: 1,
                            phone: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: '_id',
                foreignField: 'roomid',
                as: 'location'
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ['$owner', 0], },
                location: { $arrayElemAt: ['$location', 0] }

            }
        },
        {
            $project: {
                owner: 1,
                location: 1,
                title: 1,
                description: 1,
                capacity: 1,
                price: 1,
                category: 1,
                status: 1,
                totalRooms: 1,
                roomPhotos: 1,
                rentPerMonth: 1,
                video: 1,
                thumbnail: 1,
                esewaId: 1,
                khaltiId:1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!room) {
        throw new ApiError(404, 'Room not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                room,
                'Room fetched successfully'
            )
        )

});

const getAllRooms = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const rooms = await Room.aggregate([
        {
            $match: {
                $or: [
                    { status: 'Available' },
                    { status: 'Reserved' }
                ]
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
                            fullName: 1,
                            phone: 1,
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: 'locations',
                localField: '_id',
                foreignField: 'roomid',
                as: 'location',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            latitude: 1,
                            longitude: 1,
                            address: 1
                        }
                    },

                ]
            }
        },
        {
            $addFields: {
                owner: { $arrayElemAt: ['$owner', 0], },
                location: { $arrayElemAt: ['$location', 0] }
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        // {
        //     $skip: (page - 1) * Number(limit)
        // },
        // {
        //     $limit: Number(limit)
        // },
        {
            $project: {
                owner: 1,
                location: 1,
                title: 1,
                capacity: 1,
                price: 1,
                category: 1,
                status: 1,
                totalRooms: 1,
                thumbnail: 1,
                rentPerMonth: 1,
                createdAt: 1,
                updatedAt: 1
            }
        }
    ]);

    if (!rooms) {
        throw new ApiError(404, 'Rooms not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                rooms,
                'Rooms fetched successfully'
            )
        )

});

const searchRooms = asyncHandler(async (req, res) => {

    let { page = 1, limit = 10, query, field } = req.query;
    query = query.trim();
    let searchQuery = {
        [field]: { $regex: query, $options: 'i' }
    }

    if (!query || !field) {
        throw new ApiError(400, 'All fields are required');
    }

    if (field === 'location') {
        searchQuery = {
            'location.address': { $regex: query, $options: 'i' } 
        }
    }

    const rooms = await Room.aggregate(
        [

             {
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: 'roomid',
                    as: 'location',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                latitude: 1,
                                longitude: 1,
                                address: 1
                            }
                        },
                        {
                            $addFields: {
                                address: { $toLower: '$address' }
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    location: { $arrayElemAt: ['$location', 0] }
                }
            },
            {
                $match: {
                    $and: [
                        searchQuery,
                        {
                            $or: [
                                { status: 'Available' },
                                { status: 'Reserved' }
                            ]
                        }
                    ]
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
                $skip: (Number(page) - 1) * Number(limit)
            },
            {
                $limit: Number(limit)
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    capacity: 1,
                    thumbnail: 1,
                    price: 1,
                    category: 1,
                    status: 1,
                    totalRooms: 1,
                    rentPerMonth: 1,
                    location: 1,
                    owner: 1,
                    roomPhotos: 1,
                    createdAt: 1,
                    updatedAt: 1
                }
            }
        ]
    )

    if (!rooms || rooms.length === 0) {
        throw new ApiError(404, 'Rooms not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                201,
                rooms,
                'Rooms fetched successfully'
            )
        )
});

const getRoomsByCategory = asyncHandler(async (req, res) => {
    const category = req.params?.category;
    if (!category) {
        throw new ApiError(400, 'Category is required');
    }

    const rooms = await Room.aggregate(
        [
            {
                $match: {
                    $and: [
                        { category: category },
                        {
                            $or: [
                                { status: 'Available' },
                                { status: 'Reserved' }
                            ]
                        }
                    ]
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
                $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: '_id',
                    as: 'location'
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
    if (!location) {
        throw new ApiError(400, 'Location is required');
    }

    const rooms = await Room.aggregate(
        [
            {
                $lookup: {
                    from: 'locations',
                    localField: '_id',
                    foreignField: 'roomid',
                    as: 'location',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                latitude: 1,
                                longitude: 1,
                                address: 1
                            }
                        },
                        {
                            $addFields: {
                                address: { $toLower: '$address' }
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    location: { $arrayElemAt: ['$location', 0] }
                }
            },
            {
                $match: {
                    $and: [
                        { 'location.address': location },
                        {
                            $or: [
                                { status: 'Available' },
                                { status: 'Reserved' }
                            ]
                        }
                    ]
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
                    thumbnail: 1,
                    roomPhotos: 1,
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