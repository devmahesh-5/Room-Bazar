import Location from "../models/location.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const adduserLocation = asyncHandler(async (req, res) => {
    const { latitude, longitude,address } = req.body;
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const location = await Location.create({
        latitude,
        longitude,
        address,
        user: userId
    })

    if (!location) {
        throw new ApiError(500, 'Failed to add location');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            location,
            'Location added successfully'
        )
    )
});


const getLocationByRoom = asyncHandler(async (req, res) => {
    const roomId = req.params?.id;

    if (!isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid room id');
    }

    const location = await Location.findOne({ roomid: roomId });

    if (!location) {
        throw new ApiError(404, 'Location not found');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            location,
            'Location found successfully'
        )
    )
});

const getLocationByUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id || req.params?.id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const location = await Location.findOne({ user: userId });

    if (!location) {
        throw new ApiError(404, 'Location not found');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            location,
            'Location found successfully'
        )
    )
});

const updateLocation = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { latitude, longitude,address } = req.body;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const location = await Location.findOneAndUpdate({ user: userId }, { latitude, longitude,address }, { new: true });

    if (!location) {
        throw new ApiError(500, 'Failed to update location');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            location,
            'Location updated successfully'
        )
        )
});

export {
    adduserLocation,
    getLocationByRoom,
    getLocationByUser,
    updateLocation
}