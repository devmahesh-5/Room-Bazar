import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Notification from "../models/notification.models.js";

const getNotificationsByReceiver = asyncHandler(async (req, res) => {

    const notifications = await Notification.aggregate([
        {
            $match: {
                receiver: req.user?._id
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $project: {
                _id: 1,
                message: 1,
                createdAt: 1,
                roomId: 1,
                reportId: 1,
                roommateId: 1,
                paymentId: 1,
                bookingId: 1,
                messageId: 1,
                isRead: 1
            }
        }
    ]);
    const unreadCount = notifications.filter(notification => !notification.isRead).length;


    if (!notifications) {
        throw new ApiError(500, 'Failed to fetch notifications');
    }


    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    notifications,
                    unreadCount
                },
                'Notifications fetched successfully'
            )
        );
});

const markReadNotifications = asyncHandler(async (req, res) => {

    const updatedNotifications = await Notification.updateMany({
        receiver: req.user?._id
    },
        {
            $set: {
                isRead: true
            }
        },
        {
            new: true
        }
    )
    if(!updatedNotifications) {
        throw new ApiError(500, 'Failed to mark notifications as read');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            null,
            'Notifications marked as read successfully'
        )
    );

});

export {
    getNotificationsByReceiver,
    markReadNotifications
}