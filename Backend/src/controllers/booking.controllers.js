import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import Booking from "../models/booking.models.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import { isValidObjectId } from "mongoose";
const addBooking = asyncHandler(async (req, res) => {
    const { roomId } = req.params;
    const userId = req.user?._id;

    if (!isValidObjectId(roomId) || !isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id or user id');
    }

    const Booking = await Booking.create({
        roomId,
        userId,
    })

    if (!Booking) {
        throw new ApiError(500, 'Failed to add booking');
    }

    const room = await Room.findById(roomId);

    if (!room) {
        throw new ApiError(500, 'Failed to find room');
    }
    room.booking = Booking._id;
    room.status = 'Reserved';
    room.save({ validateBeforeSave: false });
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(500, 'Failed to find user');
    }
    const notification = await Notification.create({
        receiver : room.owner,
        roomId : room._id,
        message : `${user.fullName} have booked your room`,
        bookingId : Booking._id,
        roomId : room._id,
     });
     
     if(!notification) {
        throw new ApiError(500, 'Failed to create notification');
     }

    res.
    status(200)
    .json(
        new ApiResponse(200, 'Booking added successfully', Booking

        ));
});

const updateBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params?.id;
    const checksIn = req.body?.checksIn;
    if (!isValidObjectId(bookingId)) {
        throw new ApiError(400, 'Invalid booking id');
    }

    const updatedBooking = await Booking.findOneAndUpdate({
        _id: bookingId,
        userId: req.user?._id
    },
        {
            $set: {
                checksIn
            }
        },
        {
            new: true
        }
    )

    if (!updatedBooking) {
        throw new ApiError(500, 'Failed to update booking');
    }
   const room = await Room.findById(updatedBooking.roomId);
   if (!room) {
    throw new ApiError(500, 'Failed to find room');
   }

   const user = await User.findById(req.user?._id);
   if (!user) {
    throw new ApiError(500, 'Failed to find user');
   }
    const notification = await Notification.create({
        receiver : room.owner,
        roomId : updatedBooking.roomId,
        message : `${user.fullName} have checked in your room`,
        bookingId : updatedBooking._id,
        roomId : updatedBooking.roomId,
     });
     
     if(!notification) {
        throw new ApiError(500, 'Failed to create notification');
     }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedBooking,
                'Booking updated successfully'
            )
        )
});

const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await Booking.find();

    if (!bookings) {
        throw new ApiError(500, 'Failed to get bookings');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                bookings,
                'Bookings fetched successfully'
            )
        )
});

const getBookingsByUser = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid user id');
    }

    const bookings = await Booking.find({ userId });

    if (!bookings) {
        throw new ApiError(500, 'Failed to get bookings');
    }

    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            bookings,
            'Bookings fetched successfully'
        )
    )
});

export {
    addBooking,
    updateBooking,
    getAllBookings,
    getBookingsByUser
}

