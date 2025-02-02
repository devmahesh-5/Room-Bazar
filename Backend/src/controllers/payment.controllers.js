import { v4 as uuidv4 } from 'uuid';
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import Room from "../models/room.models.js";
import Payment from "../models/payment.models.js";
import { ApiResponse } from "../utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
const createPayment = asyncHandler(async (req, res) => {
    const roomId = req.params?.id;

    if (!isValidObjectId(roomId)) {
        throw new ApiError(400, 'Invalid room id');
    }
    const room = await Room.findById(roomId);

    if (!room) {
        throw new ApiError(404, 'Room not found');
    }
    const total_amount = room.price;
    const amount = total_amount - total_amount * 0.1;
    const transaction_uuid = uuidv4();
    const product_code = process.env.PRODUCT_CODE;
    const product_service_charge = total_amount * 0.1;
    const success_url = `${process.env.BASE_URL}/payment/success/${transaction_uuid}`;
    const failure_url = `${process.env.BASE_URL}/payment/failure/${transaction_uuid}`;
    const signed_field_names = 'total_amount,transaction_uuid,product_code';
    const dataToSign = `${total_amount},${transaction_uuid},${product_code}`;
    const signature = crypto.createHmac('sha512', process.env.ESEWA_SECRET_KEY).update(dataToSign)
        .digest('base64');

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
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {amount,
                tax_amount: 0,
                product_service_charge,
                product_delivery_charge: 0,
                total_amount,
                transaction_uuid,
                product_code,
                success_url,
                failure_url,
                signed_field_names,
                signature},
                'Payment initiated successfully'
            )
        );

});

const handleSuccess = asyncHandler(async (req, res) => {
    const transaction_uuid = req.query.transaction_uuid;
    
    if (!transaction_uuid) {
        throw new ApiError(400, 'Invalid transaction uuid');
    }

    const payment = await Payment.findOne({ transaction_uuid });
    if (!payment) {
        throw new ApiError(404, 'Payment not found');
    }

    payment.status = 'Success';
    await payment.save({ validateBeforeSave: false });
    const updatedPayment = await Payment.findById(payment._id);
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
//for esewa payment , esewa sends response in front end we need to make a post request with this data
//to handle success and failure 
