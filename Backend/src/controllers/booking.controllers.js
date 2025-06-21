import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import Booking from "../models/booking.models.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import { isValidObjectId } from "mongoose";

const addBooking = asyncHandler(async (req, res) => {
    const roomId  = req.params?.roomId;
    const userId = req.user?._id;
    
    if (!isValidObjectId(roomId) || !isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id or user id');
    }

    const foundRoom = await Room.findById(roomId);

    if (!foundRoom) {
        throw new ApiError(500, 'Failed to find room');
    }
    if(foundRoom.status === 'Reserved'){
        throw new ApiError(400, 'Room is already reserved');
    }

    if(foundRoom.status === 'Booked'){
        throw new ApiError(400, 'Room is already booked');
    }

    const booking = await Booking.create({
        roomId,
        userId,
        reservedAt: Date.now()
    });

    if (!booking) {
        throw new ApiError(500, 'Failed to add booking');
    }

   const room = await Room.findByIdAndUpdate(roomId, {
        $set: {
            booking: booking._id,
            status: 'Reserved',
            reservedAt: Date.now()
        }
    },
    { new: true }
);

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(500, 'Failed to find user');
    }
    const notification = await Notification.create({
        receiver : room.owner,
        roomId : room._id,
        message : `${user.fullName} have Reserved your room`,
        bookingId : Booking._id,
        roomId : room._id,
     });
     
     if(!notification) {
        throw new ApiError(500, 'Failed to create notification');
     }

    res.
    status(200)
    .json(
        new ApiResponse(
            200,
            room,
            'Booking added successfully'

        ));
});

const updateBooking = asyncHandler(async (req, res) => {
    const bookingId = req.params?.bookingId;

    if (!isValidObjectId(bookingId)) {
        throw new ApiError(400, 'Invalid booking id');
    }
    const foundBooking = await Booking.findById(bookingId);

    if (!foundBooking) {
        throw new ApiError(404, 'Booking not found');
    }
    if(foundBooking.status !== 'Booked'){
        throw new ApiError(400, 'you can only check in a booked room');
    }
    
    const updatedBooking = await Booking.findOneAndUpdate({
        _id: bookingId,
        userId: req.user?._id
    },
        {
            $set: {
                status: 'CheckedIn'
            }
        },
        {
            new: true
        }
    )

    if (!updatedBooking) {
        throw new ApiError(500, 'Failed to update booking');
    }
   const room = await Room.findByIdAndUpdate(updatedBooking.roomId,{
    $set: {
        status: 'CheckedIn'
    }
   });

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

    const bookings = await Booking.aggregate([
        {
            $match: {
                userId: userId,
                $or : [
                    {status : 'Booked'},
                    {status : 'CheckedIn'}
                ]
                
            }
        },
        {
            $lookup: {
                from: 'rooms',
                localField: 'roomId',
                foreignField: '_id',
                as: 'room',
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            price: 1,
                            category: 1,
                            location: 1,
                            owner: 1,
                            status: 1,
                            thumbnail: 1,
                            rentPerMonth: 1
                        }
                    }   
                ]
            }
        },
        {
            $addFields: {
                room: {
                    $arrayElemAt: ['$room', 0]
                }
            }
        },
        {
            $project: {
                _id: 1,
                roomId: 1,
                userId: 1,
                status: 1,
                room: 1
            }
        }
    ])

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

