import { v4 as uuidv4 } from 'uuid';
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import Room from "../models/room.models.js";
import Payment from "../models/payment.models.js";
import { ApiResponse } from "../utils/ApiResponse";
import { isValidObjectId } from "mongoose";
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Notification from "../models/notification.models.js";
    
const generateSignature = (dataToSign) => {
    const signature = crypto.createHmac('sha512', process.env.ESEWA_SECRET_KEY).update(dataToSign)
        .digest('base64');
    return signature;
};

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
    res
        .status(200)
        .json(
            new ApiResponse(
                200,
                htmlForm,
                'Payment initiated successfully'
            )
        );

});

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

