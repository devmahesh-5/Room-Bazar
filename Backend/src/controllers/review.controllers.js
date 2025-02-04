import mongoose from "mongoose";
import Review from "../models/review.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Notification  from "../models/notification.models.js";
import User from "../models/user.models.js";
import Room from "../models/room.models.js";
const addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    if([rating, comment].some((field) => !field || field.trim() === '')){
        throw new ApiError(400, 'All fields are required');
    }

    const userId = req.user?._id;
    const roomId = req.params?.id;

    if(!isValidObjectId(userId) || !isValidObjectId(roomId)){
        throw new ApiError(400, 'Invalid user id or room id');
    }

    const review = await Review.create({
        userId,
        roomId,
        rating,
        comment
    })

    if(!review){
        throw new ApiError(500, 'Failed to add review');
    }
    const user = await User.findById(userId);
    const room = await Room.findById(roomId);
    const ownerId= room.owner;
    const notification = await Notification.create({
        receiver : ownerId,
        message : `${user?.fullName} has left a review for your room`,
        reviewId : review._id,
        roomId : review.roomId,
     });
     
     if(!notification) {
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
    const reviewId = req.params?.id;

    if(!isValidObjectId(reviewId)){
        throw new ApiError(400, 'Invalid review id');
    }

    const deletedReview = await Review.findOneAndDelete({
        _id: reviewId,
        userId: req.user?._id
    })

    if(!deletedReview){
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
    const roomId = req.params?.id;

    if(!isValidObjectId(roomId)){
        throw new ApiError(400, 'Invalid room id');
    }

    const reviews = await Review.find({
        roomId
    })

    if(!reviews){
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
    const reviewId = req.params?.id;
    const { rating, comment } = req.body;
    if(!isValidObjectId(reviewId)){
        throw new ApiError(400, 'Invalid review id');
    }

    const updatedReview = await Review.findOneAndUpdate(
        {
            _id: reviewId,
            userId: req.user?._id
        },
        {
            $set :{
                rating,
                comment}
        },
        {
            new: true
        }
    )

    if(!updatedReview){
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


export { addReview, deleteReview, getReviews, updateReview };