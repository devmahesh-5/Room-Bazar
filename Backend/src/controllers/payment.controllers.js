import { v4 as uuidv4 } from 'uuid';
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Room from "../models/room.models.js";
import Payment from "../models/payment.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { isValidObjectId } from "mongoose";
import axios from "axios";
import Notification from "../models/notification.models.js";
import { generateSignature } from "../constants.js";
import User from "../models/user.models.js";
import Booking from '../models/booking.models.js';
const createPayment = asyncHandler(async (req, res) => {
  const { roomId } = req.params;
  const { paymentGateway } = req.body;

  // Validate inputs
  if (!isValidObjectId(roomId)) {
    throw new ApiError(400, 'Invalid room id');
  }

  // Find booking and room
  const [booking, room, user] = await Promise.all([
    Booking.findOne({
      roomId,
      status: 'Reserved',
      userId: req.user._id
    }),
    Room.findById(roomId),
    User.findById(req.user._id)
  ]);
  if (!booking) throw new ApiError(404, 'Booking Session Ended');

  if (!room) throw new ApiError(404, 'Room not found');

  const transaction_uuid = uuidv4();
  const total_amount = room.price;

  // Create payment record first
  const payment = await Payment.create({
    userId: req.user._id,
    roomId,
    amount: total_amount,
    status: 'Pending',
    paymentGateway,
    transaction_uuid,
    booking: booking._id
  });
  booking.payment = payment._id;
  await booking.save({ validateBeforeSave: false });
  if (!payment) throw new ApiError(500, 'Failed to create payment record');


  try {
    if (paymentGateway === 'ESewa') {
      // ESewa implementation
      const amount = total_amount - total_amount * 0.1;
      const product_code = process.env.PRODUCT_CODE;
      const product_service_charge = total_amount * 0.1;
      const success_url = `${process.env.FRONTEND_URL}/payments/esewa/success/${payment._id}`;
      const failure_url = `${process.env.FRONTEND_URL}/payments/esewa/failure/${payment._id}`;
      const signed_field_names = 'total_amount,transaction_uuid,product_code';
      const dataToSign = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
      const signature = generateSignature(dataToSign);

      const htmlForm = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #F2F4F7;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
          }
          .payment-form {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            padding: 30px;
            max-width: 500px;
            width: 100%;
          }
          .form-header {
            color: #6C48E3;
            text-align: center;
            margin-bottom: 25px;
          }
          .form-group {
            margin-bottom: 15px;
          }
          .form-group label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: 500;
          }
          .form-group input {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: #F2F4F7;
            color: #333;
          }
          .submit-btn {
            background-color: #6C48E3;
            color: white;
            border: none;
            padding: 12px 20px;
            width: 100%;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
            margin-top: 10px;
          }
          .submit-btn:hover {
            background-color: #5a3acf;
          }
          .amount-highlight {
            font-size: 18px;
            font-weight: bold;
            color: #6C48E3;
          }
        </style>
      </head>
      <body>
        <div class="payment-form">
          <div class="form-header">
            <h2>Complete Your Payment</h2>
            <p>You're paying via eSewa</p>
          </div>
          
          <form action="https://rc-epay.esewa.com.np/api/epay/main/v2/form" method="POST">
            <!-- Amount Fields -->
            <div class="form-group">
              <label>Amount (NPR)</label>
              <input name="amount" value="${amount}" readonly class="amount-highlight">
            </div>
            
            <div class="form-group">
              <label>Tax Amount</label>
              <input name="tax_amount" value="0" readonly>
            </div>
            
            <div class="form-group">
              <label>Total Amount</label>
              <input name="total_amount" value="${total_amount}" readonly class="amount-highlight">
            </div>
            
            <!-- Transaction Details -->
            <div class="form-group">
              <label>Transaction ID</label>
              <input name="transaction_uuid" value="${transaction_uuid}" readonly>
            </div>
            
            <div class="form-group">
              <label>Product Code</label>
              <input name="product_code" type="hidden" value="${product_code}" readonly>
            </div>
            
            <div class="form-group">
              <label>Service Charge</label>
              <input name="product_service_charge" value="${product_service_charge}" readonly>
            </div>
            
            <!-- Hidden Required Fields -->
            <input type="hidden" name="product_delivery_charge" value="0">
            <input type="hidden" name="success_url" value="${success_url}">
            <input type="hidden" name="failure_url" value="${failure_url}">
            <input type="hidden" name="signed_field_names" value="${signed_field_names}">
            <input type="hidden" name="signature" value="${signature}">
            
            <button type="submit" class="submit-btn">Pay Now</button>
          </form>
        </div>
      </body>
    </html>
    `;

      res.status(200).json(
        new ApiResponse(200, {
          htmlForm
        }, 'ESewa payment initiated')
      );

    } else if (paymentGateway === 'Khalti') {
      // Khalti implementation
      const payload = {
        return_url: `${process.env.FRONTEND_URL}/payments/khalti/success/${payment._id}`,
        website_url: process.env.FRONTEND_URL,
        amount: total_amount * 100, // Khalti uses paisa
        purchase_order_id: payment._id,
        purchase_order_name: `Booking for ${room.title}`,
        customer_info: {
          name: user.fullName,
          email: user.email,
          phone: user.phone
        }
      };

      const khaltiResponse = await axios.post(
        'https://dev.khalti.com/api/v2/epayment/initiate/',
        payload,
        {
          headers: {
            Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Update payment with Khalti reference
      payment.paymentGateway = JSON.stringify(khaltiResponse.data);
      await payment.save({ validateBeforeSave: false });

      res.setHeader('Access-Control-Allow-Origin', 'https://room-bazar.vercel.app');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      res.status(200).json(
        new ApiResponse(200, {
          gateway: 'khalti',
          payment_url: khaltiResponse.data.payment_url
        }, 'Khalti payment initiated')
      );
    } else {
      throw new ApiError(400, 'Invalid payment gateway');
    }
  } catch (error) {
    // Mark payment as failed on error
    payment.status = 'Failed';
    room.status = 'Available';
    booking.status = 'Reserved';
    await payment.save({ validateBeforeSave: false });
    await room.save({ validateBeforeSave: false });
    await booking.save({ validateBeforeSave: false });
    console.error('Payment processing error:', error);
    throw new ApiError(500, 'Payment processing failed');
  }
});

const handleEsewaSuccess = asyncHandler(async (req, res) => {
  try {
    const payment_id = req.params.paymentId;
    const esewaData = req.query.data;//decode the data and store in paymentGatewayDetail
    const decodedData = Buffer.from(esewaData, 'base64').toString('utf-8');
    const paymentGatewayDetail = JSON.parse(decodedData);

    const fieldsToSign = paymentGatewayDetail.signed_field_names.split(',');

    // 2. Create the signing string
    const dataToSign = fieldsToSign
      .map(field => `${field}=${paymentGatewayDetail[field]}`)
      .join(',');

    const signature = generateSignature(dataToSign);

    if (signature !== paymentGatewayDetail.signature) {
      throw new ApiError(400, 'Invalid signature');

    }
    const payment = await Payment.findByIdAndUpdate(payment_id, {
      $set: {
        status: 'Success',
        paymentGateway: JSON.stringify(paymentGatewayDetail)
      },
    },
      {
        new: true
      })
    const updatedPayment = await Payment.findById(payment._id);
    const room = await Room.findByIdAndUpdate(payment.roomId, {
      $set: { status: 'Booked', }
    },
      {
        new: true
      })
    const booking = await Booking.findByIdAndUpdate(payment.booking, {
      $set: { status: 'Booked' }
    },
      {
        new: true
      });
    const notification = await Notification.create({
      receiver: payment.userId,
      message: 'Payment for booking with Rs ' + payment.amount + ' success with esewa',
      paymentId: payment._id,
      roomId: payment.roomId,
    });

    if (!notification) {
      throw new ApiError(500, 'Failed to create notification');
    }

    res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPayment,
        'Payment updated successfully'
      )
    )
  } catch (error) {
    throw new ApiError(500, 'Payment processing failed if your payment was successful, please contact Room Bazar');
  }
});

const handleKhaltiSuccess = asyncHandler(async (req, res) => {

  const paymentId = req.params.paymentId;
  const { pidx } = req.query;
  try {
    const verification = await axios.post(
      'https://dev.khalti.com/api/v2/epayment/lookup/',
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_LIVE_SECRET_KEY}`
        }
      }
    );

    // 2. Update database if payment is successful
    if (verification.data.status === 'Completed') {

      const updatedPayment = await Payment.findByIdAndUpdate(
        paymentId,
        {
          status: 'Success',
          gatewayResponse: verification.data,
          paidAt: Date.now()
        },
        { new: true }
      );

      if (!updatedPayment) {
        return res.redirect(`${process.env.FRONTEND_URL}/payments/failed`);
      }

      const updatedRoom = await Room.findByIdAndUpdate(
        updatedPayment.roomId,
        { status: 'Booked' },
        { new: true }
      );

      const updatedBooking = await Booking.findByIdAndUpdate(
        updatedPayment.booking,
        { status: 'Booked' },
        { new: true }
      );

      if (!updatedRoom || !updatedBooking) {
        return res.redirect(`${process.env.FRONTEND_URL}/payment/failed`);
      }


      const notification = await Notification.create({
        receiver: updatedPayment.userId,
        message: 'Payment success',
        paymentId: updatedPayment._id,
        roomId: updatedPayment.roomId,
      });

      if (!notification) {
        throw new ApiError(500, 'Failed to create notification');
      }

      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            null,
            'Payment updated successfully'
          )
        );

    }

  } catch (error) {
    throw new ApiError(500, 'Payment processing failed if your payment was successful, please contact Room Bazar');
  }
})

export { createPayment, handleEsewaSuccess, handleKhaltiSuccess };

