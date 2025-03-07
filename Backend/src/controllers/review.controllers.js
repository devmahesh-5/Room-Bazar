import mongoose from "mongoose";
import Review from "../models/review.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Notification from "../models/notification.models.js";
import User from "../models/user.models.js";
import Room from "../models/room.models.js";
import { isValidObjectId } from "mongoose";
const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const userId = req.user?._id;
    const roomId = req.params?.roomId;

    if ([rating, comment].some((field) => !field)) {
        throw new ApiError(400, 'All fields are required');
    }
    const trimmedComment = comment.trim();
    if (!isValidObjectId(userId) || !isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid user id or room id');
    }

    const review = await Review.create({
        userId,
        roomId,
        rating,
        comment: trimmedComment
    })

    if (!review) {
        throw new ApiError(500, 'Failed to add review');
    }
    const user = await User.findById(userId);
    const room = await Room.findById(roomId);
    const ownerId = room.owner;
    const notification = await Notification.create({
        receiver: ownerId,
        message: `${user?.fullName} has left a review for your room`,
        reviewId: review._id,
        roomId: review.roomId,
    });

    if (!notification) {
        throw new ApiError(500, 'Failed to create notification');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                review,
                'Review added successfully'
            )
        )

});

const deleteReview = asyncHandler(async (req, res) => {
    const roomId = req.params?.roomId;
    const reviewId = req.params?.reviewId;

    if (!isValidObjectId(reviewId)) {
        throw new ApiError(400, 'Invalid review id');
    }

    const deletedReview = await Review.findOneAndDelete({
        _id: reviewId,
        roomId,
        userId: req.user?._id
    })

    if (!deletedReview) {
        throw new ApiError(500, 'Failed to delete review');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                deletedReview,
                'Review deleted successfully'
            )
        )

});

const getReviews = asyncHandler(async (req, res) => {
    const roomId = req.params?.roomId;

    if (!isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const reviews = await Review.aggregate([
        {
            $match: {
                roomId: new mongoose.Types.ObjectId(roomId)
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
        },
        {
            $project: {
                _id: 1,
                rating: 1,
                comment: 1,
                createdAt: 1,
                user: 1,
            }
        }
    ])

    if (!reviews) {
        throw new ApiError(404, 'Reviews not found');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                reviews,
                'Reviews fetched successfully'
            )
        )
});

const updateReview = asyncHandler(async (req, res) => {
    const roomId = req.params?.roomId;
    const reviewId = req.params?.reviewId;
    const updatedParameters = req.body;

    Object.keys(updatedParameters).forEach((key) => {
        if (!updatedParameters[key]) {
            delete updatedParameters[key];
        }else{
        updatedParameters[key] = updatedParameters[key].trim();
    }
    });
    if (!isValidObjectId(reviewId)) {
        throw new ApiError(400, 'Invalid review id');
    }

    const updatedReview = await Review.findOneAndUpdate(
        {        
            roomId,
            _id: reviewId,
            userId: req.user?._id
        },
        {
            $set: updatedParameters
        },
        {
            new: true
        }
    )

    if (!updatedReview) {
        throw new ApiError(500, 'Failed to update review');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedReview,
                'Review updated successfully'
            )
        )
});


export {
    addReview,
    deleteReview,
    getReviews,
    updateReview
};