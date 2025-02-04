import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import Notification from "../models/notification.models.js";

const getNotificationsByReceiver = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({receiver: req.user?._id});
    
    if(!notifications){
        throw new ApiError(500, 'Failed to fetch notifications');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            notifications,
            'Notifications fetched successfully'
        )
    );
});

export {
    getNotificationsByReceiver
}