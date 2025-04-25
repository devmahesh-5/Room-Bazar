import Favourite from "../models/favourite.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Notification from "../models/notification.models.js";
import {isValidObjectId} from "mongoose";
import Room from "../models/room.models.js";

const toggleFavourite = asyncHandler(async (req, res) => {
    const roomId = req.params?.roomId;
    
    if(!isValidObjectId(roomId)){
        throw new ApiError(400, 'Invalid room id');
    }

    const favourite = await Favourite.findOne({
        userId : req.user?._id,
        roomId
    })
    let isFavourite = false;
    if(favourite){
        //delete favourite
        const deletedFavourite = await Favourite.findByIdAndDelete(favourite._id);

        if(!deletedFavourite){
            throw new ApiError(500, 'Failed to delete favourite');
        }
    }else{
        //add favourite
        const addedFavourite = await Favourite.create({
            userId : req.user?._id,
            roomId
        })

        if(!addedFavourite){
            throw new ApiError(500, 'Failed to add favourite');
        }

        isFavourite = true;
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {isFavourite: isFavourite},
            'Favourite toggled successfully'
        )
    )
})


const getUserFavourites = asyncHandler(async (req, res) => {
    // const {limit=10, page=1} = req.query;
    const userId = req.user?._id;

    if(!isValidObjectId(userId)){
        throw new ApiError(400, 'Invalid user id');
    }

    const favourites = await Favourite.aggregate(
        [
            {
                $match : {
                    userId
                }
            },
            {
                $lookup : {
                    from : 'rooms',
                    localField : 'roomId',
                    foreignField : '_id',
                    as : 'room',
                    pipeline : [
                        
                            {
                                
                                $lookup : {
                                    from : 'locations',
                                    localField : 'location',
                                    foreignField : '_id',
                                    as : 'location'
                                }
                            },
                            {
                                $lookup : {
                                    from : 'users',
                                    localField : 'owner',
                                    foreignField : '_id',
                                    as : 'owner'
                                }
                            },
                            {
                                $addFields : {
                                    location : { $arrayElemAt : ['$location', 0] },
                                    owner : { $arrayElemAt : ['$owner', 0] }
                                }
                            },
                            {
                            $project : {
                                _id :1,
                                title : 1,
                                price : 1,
                                thumbnail: 1,
                                location : 1,
                                rentPerMonth : 1,
                                price : 1,
                                owner : 1,
                                status : 1
                            }
                        }
                    ]
                }
            },
            {
                $sort : {
                    createdAt : -1
                }
            },
            // {
            //     $skip : (page-1)*limit
            // },
            // {
                
            //     $limit : limit
            // },
            {
                $project : {
                    _id : 1,
                    room : 1
                }
            }
        ]
    )
    

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


const getFavouriteByRoomId = asyncHandler(async (req, res) => {
    const roomId = req.params?.roomId;

    if(!isValidObjectId(roomId)){
        throw new ApiError(400, 'Invalid room id');
    }

    const favourite = await Favourite.findOne({
        roomId,
        userId : req.user?._id
    })

    if(!favourite){
        throw new ApiError(404, 'Favourite not found');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            favourite,
            'Favourite fetched successfully'
        )
    )


})
export {
    toggleFavourite,
    getUserFavourites,
    getFavouriteByRoomId
}