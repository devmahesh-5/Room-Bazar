import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Message from "../models/message.models.js";
import mongoose, { isValidObjectId } from "mongoose";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import { uploadMultipleFilesOnCloudinary } from "../utils/Cloudinary.js";

const createMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const sender = req.user?._id;
    const receiver = req.params?.userId;

    let fileLocalPaths = [];

    if(req.files?.messageFiles?.length>0){
        fileLocalPaths = req.files?.messageFiles.map(file => file.path);
    }
    
    let messageFilesCloudinaryUrls;

    if(fileLocalPaths?.length>0){
        messageFilesCloudinaryUrls = await uploadMultipleFilesOnCloudinary(...fileLocalPaths);
    }
    
    if(!message && !messageFilesCloudinaryUrls){
        throw new ApiError(400, 'cannot send empty message');
    }

    if (!isValidObjectId(sender) || !isValidObjectId(receiver)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const newMessage = await Message.create({
        sender,
        receiver,
        message,
        messageFiles: messageFilesCloudinaryUrls
    })

    if (!newMessage) {
        throw new ApiError(500, 'Failed to create message');
    }

    const senderUser = await User.findById(sender);

    await Notification.create({
        receiver,
        message: `You have a new message from ${senderUser.fullName}`,
        messageId: newMessage._id
    })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                newMessage,
                'Message created successfully'
            )
        )
})

const getUserMessages = asyncHandler(async (req, res) => {
    //By sender or receiver id
    const sender = req.user?._id;
    const receiver = req.params?.userId;

    if (!isValidObjectId(sender) || !isValidObjectId(receiver)) {
        throw new ApiError(400, 'Invalid user id');
    }

    // console.log(sender, receiver);
    
    const messages = await Message.aggregate(
        [
            {
                $match: {
                    $or: [
                        { sender:new mongoose.Types.ObjectId(sender), receiver:new mongoose.Types.ObjectId(receiver) },
                        { sender:new mongoose.Types.ObjectId(receiver), receiver: new mongoose.Types.ObjectId(sender) }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender',
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'receiver',
                    foreignField: '_id',
                    as: 'receiver',
                    pipeline: [
                        {
                            $project: {
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    sender: { $arrayElemAt: ['$sender', 0] },
                    receiver: { $arrayElemAt: ['$receiver', 0] }
                }
            },
            {
                $sort: {
                    createdAt: 1
                }
            },
            {
                $project: {
                    sender: 1,
                    receiver: 1,
                    message: 1,
                    createdAt: 1,
                    messageFiles: 1
                }
            }
        ]
    )

    if (!messages || messages.length === 0) {
        throw new ApiError(500, 'Failed to get messages');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                messages,
                'Messages fetched successfully'
            )
        )
})

const deleteMessage = asyncHandler(async (req, res) => {
    const messageId = req.params?.messageId;
    const receiver = req.params?.userId;

    if (!isValidObjectId(messageId) || !isValidObjectId(receiver)) {
        throw new ApiError(400, 'Invalid message id or user id');
    }

    const deletedMessage = await Message.findOneAndDelete({
        sender: req.user?._id,
        _id: messageId,
        receiver
    })

    if (!deletedMessage) {
        throw new ApiError(500, 'Failed to delete message');
    }

    await Notification.findOneAndDelete({
        messageId
    })

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedMessage,
                'Message deleted successfully'
            )
        )

});

const getMessageProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const messageProfile = await Message.aggregate(
        [
            {
                $match: {
                    $or: [
                        { sender: new mongoose.Types.ObjectId(userId)},
                        { receiver: new mongoose.Types.ObjectId(userId)}
                    ]
                }
            },
            {
                $group:{
                    _id :{
                        $cond: {
                            if: { "$eq": ["$sender", new mongoose.Types.ObjectId(userId)] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    createdAt: { $max: "$createdAt" }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }
                    ]
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] }
            }
        }

        ]
    )

    if(!messageProfile){
        throw new ApiError(500, 'Failed to get message profile');
    }

    res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            messageProfile,
            'Message profile fetched successfully'
        )
    )

});

export {
    createMessage,
    getUserMessages,
    deleteMessage,
    getMessageProfile
}