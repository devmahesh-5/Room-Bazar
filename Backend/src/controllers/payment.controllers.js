
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import Payment from "../models/payment.models.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {isValidObjectId} from "mongoose";
import {v4 as uuidv4} from 'uuid';
import crypto from 'crypto';
import Notification from "../models/notification.models.js";
    
import { generateSignature } from "../constants.js";    

// const createPayment = asyncHandler(async (req, res) => {
//     // const roomId = req.params?.roomId;

//     // if (!isValidObjectId(roomId)) {
//     //     throw new ApiError(400, 'Invalid room id');
//     // }
//     // const room = await Room.findById(roomId);

//     // if (!room) {
//     //     throw new ApiError(404, 'Room not found');
//     // }
    
    
//     // res
//     //     .status(200)
//     //     .json(
//     //         new ApiResponse(
//     //             200,
//     //             htmlForm,
//     //             'Payment initiated successfully'
//     //         )
//     //     );

// });

const handleSuccess = asyncHandler(async (req, res) => {
    const esewaData = req.query.data;//decode the data and store in paymentGatewayDetail
    const decodedData = Buffer.from(esewaData, 'base64').toString('utf-8');
    const paymentGatewayDetail = JSON.parse(decodedData);
    const dataToSign = `${paymentGatewayDetail.total_amount},${paymentGatewayDetail.transaction_uuid},${paymentGatewayDetail.product_code}`;

    const signature = generateSignature(dataToSign);

    if (signature !== paymentGatewayDetail.signature) {
        throw new ApiError(400, 'Invalid signature');
    }
    const transaction_uuid = paymentGatewayDetail.transaction_uuid;
    if (!transaction_uuid) {
        throw new ApiError(400, 'Invalid transaction uuid');
    }

    const payment = await Payment.findOne({ transaction_uuid });
    if (!payment) {
        throw new ApiError(404, 'Payment not found');
    }

    payment.status = 'Success';
    payment.paymentGateway = paymentGatewayDetail;
    // payment.paymentGateway = //get payment gateway response from esewa

    await payment.save({ validateBeforeSave: false });
    const updatedPayment = await Payment.findById(payment._id);

    const notification = await Notification.create({
       receiver : payment.userId,
       message : 'Payment success',
       paymentId : payment._id,
       roomId : payment.roomId,
    });

    if(!notification) {
        throw new ApiError(500, 'Failed to create notification');
    }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPayment,
                'Payment success'
            )
        );
});

const handleFailure = asyncHandler(async (req, res) => {
    const transaction_uuid = req.query.transaction_uuid;

    if (!transaction_uuid) {
        throw new ApiError(400, 'Invalid transaction uuid');
    }

    const payment = await Payment.findOne({ transaction_uuid });

    if (!payment) {
        throw new ApiError(404, 'Payment not found');
    }
    payment.status = 'Failed';
    await payment.save({ validateBeforeSave: false });
    const updatedPayment = await Payment.findById(payment._id);

    const Notification = await Notification.create({
        receiver : payment.userId,
        message : 'Payment failed',
        paymentId : payment._id,
        roomId : payment.roomId,
     });
     
     if(!Notification) {
        throw new ApiError(500, 'Failed to create notification');
     }

    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPayment,
                'Payment failed'
            )
        );
});

export { createPayment, handleSuccess, handleFailure };

