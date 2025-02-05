import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Message from "../models/message.models.js";
import { isValidObjectId } from "mongoose";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";

const createMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    const sender = req.user?._id;
    const receiver = req.params?.userId;

    if (!isValidObjectId(sender) || !isValidObjectId(receiver)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const newMessage = await Message.create({
        sender,
        receiver,
        message
    })

    if (!newMessage) {
        throw new ApiError(500, 'Failed to create message');
    }
    const senderUser = await User.findById(sender);

    await Notification.create({
        receiver,
        message: `You have a new message from ${senderUser.fullName}`
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

    const messages = await Message.aggregate(
        [
            {
                $match: {
                    $or: [
                        { sender, receiver },
                        { sender: receiver, receiver: sender }
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
                    createdAt: -1
                }
            },
            {
                $project: {
                    sender: 1,
                    receiver: 1,
                    message: 1,
                    createdAt: 1
                }
            }
        ]
    )

    if (!messages) {
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

    if (!isValidObjectId(messageId)) {
        throw new ApiError(400, 'Invalid message id');
    }

    const deletedMessage = await Message.findOneAndDelete({
        sender: req.user?._id,
        _id: messageId
    })

    if (!deletedMessage) {
        throw new ApiError(500, 'Failed to delete message');
    }

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
                        { sender: userId },
                        { receiver: userId }
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
                    createdAt: -1
                }
            },
            {
                $project: {
                    profile: {
                        $cond: {
                            if: { "$eq": ["$sender._id", userId] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    },
                    message: 0,
                    createdAt: 1
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