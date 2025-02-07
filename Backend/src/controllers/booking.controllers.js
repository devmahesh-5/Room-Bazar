import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import Booking from "../models/booking.models.js";
import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import { isValidObjectId } from "mongoose";
import {v4 as uuidv4} from 'uuid';
import Payment from "../models/payment.models.js";
import { generateSignature } from "../constants.js";

const addBooking = asyncHandler(async (req, res) => {
    const roomId  = req.params?.roomId;
    const userId = req.user?._id;
    
    if (!isValidObjectId(roomId) || !isValidObjectId(userId)) {
        throw new ApiError(400, 'Invalid room id or user id');
    }

    const booking = await Booking.create({
        roomId,
        userId,
    });
    if (!booking) {
        throw new ApiError(500, 'Failed to add booking');
    }

    const foundRoom = await Room.findById(roomId);

    if (!foundRoom) {
        throw new ApiError(500, 'Failed to find room');
    }
    
   const room = await Room.findByIdAndUpdate(roomId, {
        $set: {
            booking: booking._id,
            status: 'Reserved'
        }
    },
    { new: true }
);


    const total_amount = room.price;
    const amount = total_amount - total_amount * 0.1;
    const transaction_uuid = uuidv4();
    const product_code = process.env.PRODUCT_CODE;
    const product_service_charge = total_amount * 0.1;
    const success_url = `${process.env.BASE_URL}/payment/success`;
    const failure_url = `${process.env.BASE_URL}/payment/failure`;
    const signed_field_names = 'total_amount,transaction_uuid,product_code';
    const dataToSign = `${total_amount},${transaction_uuid},${product_code}`;
    
    const signature = generateSignature(dataToSign);
        const htmlForm = `
        <html>
            <body>
                <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
                    <input type="hidden" name="amount" value="${amount}">
                    <input type="hidden" name="tax_amount" value="0">
                    <input type="hidden" name="total_amount" value="${total_amount}">
                    <input type="hidden" name="transaction_uuid" value="${transaction_uuid}">
                    <input type="hidden" name="product_code" value="${product_code}">
                    <input type="hidden" name="product_service_charge" value="${product_service_charge}"}>
                    <input type="hidden" name="product_delivery_charge" value="0">
                    <input type="hidden" name="success_url" value="${success_url}">
                    <input type="hidden" name="failure_url" value="${failure_url}">
                    <input type="hidden" name="signed_field_names" value="${signed_field_names}">
                    <input type="hidden" name="signature" value="${signature}">
                    <input type="submit" value = "Pay Now"></input>
                </form>
                
            </body>
        </html>
    `;

    const payment = await Payment.create({
        userId: req.user?._id,
        roomId,
        amount: total_amount,
        status : 'Pending',
        paymentGateway: 'Esewa',
        transaction_uuid
      })

    if (!payment) {
        throw new ApiError(500, 'Failed to create payment');
    }


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
        new ApiResponse(200, 'Booking added successfully', {Booking, htmlForm}

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

