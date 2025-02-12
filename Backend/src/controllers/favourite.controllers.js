import Favourite from "../models/favourite.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Notification from "../models/notification.models.js";
import {isValidObjectId} from "mongoose";
import Room from "../models/room.models.js";

const addFavourite = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const roomId = req.params?.roomId;

    if(!isValidObjectId(userId) || !isValidObjectId(roomId)){
        throw new ApiError(400, 'Invalid user id or room id');
    }
    const existingFavourite = await Favourite.findOne({
        userId,
        roomId
    })

    if(existingFavourite){
        throw new ApiError(400, 'Room already added to favourites');
    }

    const favourite = await Favourite.create({
        userId,
        roomId
    })

    if(!favourite){
        throw new ApiError(500, 'Failed to add favourite');
    }
    
    const room = await Room.findById(roomId);
    if(!room){
        throw new ApiError(500, 'Room not found');
    }

    await Notification.create({
        receiver : req.user?._id,
        message : `Room ${room.title} has been added to your favourites`,
        roomId : room._id
    })

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            favourite,
            'Room added to favourites successfully'
        )
    )
});

//when user clicks delete button send delete request with favourite id in params 
const removeFromFavourites = asyncHandler(async (req, res) => {
    const favouriteId = req.params?.favouriteId;

    if(!isValidObjectId(favouriteId)){
        throw new ApiError(400, 'Invalid favourite id');
    }

    const deletedFavourite = await Favourite.findOneAndDelete({
        _id : favouriteId,
        userId : req.user?._id
    })

    if(!deletedFavourite){
        throw new ApiError(500, 'Failed to delete favourite');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            deletedFavourite,
            'Favourite deleted successfully'
        )
    )
});

const getUserFavourites = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, 'Invalid user id');
    }

    const favourites = await Favourite.find({
        userId
    })

    if(!favourites){
        throw new ApiError(500, 'Failed to get favourites');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            favourites,
            'Favourites fetched successfully'
        )   
    )
});

export {
    addFavourite,
    removeFromFavourites,
    getUserFavourites
}