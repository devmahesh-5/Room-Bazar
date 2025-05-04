import crypto from "crypto";
import mongoose from "mongoose";
import RoommateAccount from "./models/roommateAccount.models.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import cron from "node-cron";
import User from "./models/user.models.js";
import Room from "./models/room.models.js";
import Booking from "./models/booking.models.js";
import validator from 'validator';
import axios from "axios";
import { ApiError } from "./utils/ApiError.js";
export const DB_NAME = "Room-Bazar";

export const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax'
}//this ensures that cookie is not modifiable from frontend

export const generateSignature = (dataToSign) => {
    const signature = crypto.createHmac('sha256', process.env.ESEWA_SECRET_KEY).update(dataToSign)
        .digest('base64');
    return signature;
};

export const getRoommateByUserId = async (userId) => {

    const roommate = await RoommateAccount.aggregate(
        [
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                fullName: 1,
                                avatar: 1
                            }
                        }]
                },

            },
            {
                $lookup: {
                    from: 'locations',
                    localField: 'location',
                    foreignField: '_id',
                    as: 'location',
                    pipeline: [
                        {
                            $project: {
                                _id: 1,
                                address: 1
                            }
                        }]
                }
            },
            {
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] },
                    location: { $arrayElemAt: ['$location', 0] }
                }
            },
            {
                $project: {
                    _id: 1,
                    user: 1,
                    job: 1,
                    pets: 1,
                    smoking: 1,
                    haveRoom: 1,
                    description: 1,
                    location: 1,
                    roomPhotos: 1
                }
            }
        ]
    );

    return roommate[0];
}

export const getUserByRoommateId = async (roommateId) => {
    const user = await RoommateAccount.findById(roommateId);
    return user;
}

const otpEmailTemplate = (otp) => ({
    subject: 'Verify Your Email Address for Room-Bazar',
    text: `
      Welcome to Room-Bazar!
      
      Your one-time verification code is: ${otp}
      
      This code will expire in 5 minutes. Please don't share it with anyone.
      
      If you didn't request this, please ignore this email or contact support.
      
      The Room-Bazar Team
    `,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #F2F4F7; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #6C48E3; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Room-Bazar</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Email Verification</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Thank you for signing up with Room-Bazar. To complete your registration, please use the following 
            One-Time Password (OTP) to verify your email address:
          </p>
          
          <div style="background-color: #F2F4F7; padding: 15px; text-align: center; margin: 25px 0; border-radius: 6px;">
            <span style="font-size: 28px; letter-spacing: 3px; color: #6C48E3; font-weight: bold;">${otp}</span>
          </div>
          
          <p style="font-size: 14px; color: #777;">
            <strong>Important:</strong> This code expires in 3 minutes. Do not share it with anyone.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="font-size: 14px; color: #999; text-align: center;">
            If you didn't request this email, please ignore it or contact our support team at 
            <a href="mailto:roombazar25@gmail.com" style="color: #6C48E3;">support@room-bazar.com</a>.
          </p>
        </div>
        
        <div style="background-color: #F2F4F7; padding: 15px; text-align: center; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} Room-Bazar. All rights reserved.
        </div>
      </div>
    `
});

const accountDeletionWarningTemplate = (username, verificationLink) => ({
    subject: '⚠️ Verify Your Room-Bazar Account Within 1 Hour',
    text: `
      Important Account Notice - Action Required
      
      Dear ${username || 'User'},
      
      Your Room-Bazar account is still unverified. To protect our community, 
      we'll need to delete unverified accounts after 1 hour.
      
      Please verify your email immediately to keep your account active.

      Login and verify your Account by visiting my Profile Page:
      
      Login Link: ${verificationLink}
      
      If you encounter any issues, please contact our support team immediately.
      
      After 1 hour, all data associated with unverified accounts will be 
      permanently deleted and cannot be recovered.
      
      The Room-Bazar Team
    `,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #F2F4F7; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #FF3B30; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">⚠️ Account Verification Required</h1>
        </div>
        
        <div style="padding: 30px;">
          <h2 style="color: #333; margin-top: 0;">Dear ${username || 'User'},</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #555;">
            Your Room-Bazar account is still unverified. To maintain the security of our community,
            we automatically delete unverified accounts after <strong style="color: #FF3B30;">1 hour</strong>.
          </p>
          
          <div style="background-color: #FFF8F8; border-left: 4px solid #FF3B30; padding: 15px; margin: 20px 0;">
            <p style="font-size: 15px; margin: 0; color: #D70000;">
              <strong>Action required:</strong> Verify your email within 1 hour to prevent account deletion.
            </p>
          </div>
          
          <a href="${verificationLink}" 
             style="display: inline-block; background-color: #6C48E3; color: white; 
                    padding: 12px 24px; text-decoration: none; border-radius: 6px; 
                    font-weight: bold; margin: 15px 0;">
            Verify My Account Now
          </a>
          
          <p style="font-size: 14px; color: #777;">
            <strong>Note:</strong> This link will expire when the deadline passes. 
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          
          <div style="word-break: break-all; font-size: 12px; color: #666; padding: 10px; background-color: #F2F4F7; border-radius: 4px;">
            ${verificationLink}
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="font-size: 14px; color: #999;">
            If you don't verify your account within 1 hour, all your information will be 
            <strong>permanently deleted</strong> and cannot be recovered.
          </p>
          
          <p style="font-size: 14px; color: #999; margin-bottom: 0;">
            Need help? Contact our support team at 
            <a href="mailto:support@room-bazar.com" style="color: #6C48E3;">support@room-bazar.com</a>.
          </p>
        </div>
        
        <div style="background-color: #F2F4F7; padding: 15px; text-align: center; font-size: 12px; color: #777;">
          © ${new Date().getFullYear()} Room-Bazar. All rights reserved.
        </div>
      </div>
    `
});

export const sendOtp = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // SSL
        secure: false,
        requireTLS: true,
        auth: {
            user: `noreply@${process.env.EMAIL}`,
            pass: process.env.EMAIL_PASSWORD,
            tls: {
                rejectUnauthorized: true 
            }
        }
    });

    const { subject, text, html } = otpEmailTemplate(otp);

    try {
        await transporter.sendMail({
            from: `Room-Bazar <noreply@${process.env.EMAIL}>`,
            to: email,
            subject,
            text,
            html,
            headers: {
                'X-Priority': '1', // High priority
                'X-Mailer': 'Nodemailer'
            }
        });
        return true
    } catch (error) {
        console.error('Error sending OTP:', error);
        return false
    }
}

export const sendEmail = async (email) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // SSL
        secure: false,
        requireTLS: true,
        auth: {
            user: `noreply@${process.env.EMAIL}`,
            pass: process.env.EMAIL_PASSWORD,
            tls: {
                rejectUnauthorized: true
            }
        }
    });

    try {
        const user = await User.findOne({ email });
        const { subject, text, html } = accountDeletionWarningTemplate(user.fullName);
        await transporter.sendMail(
            {
                from: `Room-Bazar <noreply@${process.env.EMAIL}>`,
                to: email,
                subject,
                text,
                html,
                headers: {
                    'X-Priority': '1', // High priority
                    'X-Mailer': 'Nodemailer'
                }
            }
        )
        return true

    } catch (error) {
        console.error('Error sending email:', error);
        return false

    }


}

export const generateOtp = async () => {
    const otp = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false
    });
    return otp
}
export const notifyUnVerifiedUser = async () => {
    cron.schedule('0 3 * * *', async () => {
        const unVerifiedUsers = await User.find({
            is_verified: false,
            unVerified_at: { $lt: new Date(Date.now()) }
        });
        if (unVerifiedUsers.length > 0) {
            unVerifiedUsers.forEach(async (user) => {
                try {
                    await sendEmail(user.email);
                } catch (error) {
                    console.error('Error sending email to unverified user:', error);
                }
            });
        }
    },
        {
            timezone: 'Asia/Kathmandu'
        });
}
export const unVerifiedUserRemoval = async () => {
    cron.schedule('0 3 * * *', async () => {
        await User.deleteMany({
            is_verified: false,
            unVerified_at: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
    },
        {
            timezone: 'Asia/Kathmandu'
        });
}

export const emailValidator = async (email) => {
    if (!validator.isEmail(email)) {
        return false;
    }

    try {
        const exists = await new Promise((resolve, reject) => {
            emailExistence.check(email, (error, response) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        });

        return exists; // true if email exists, false otherwise
    } catch (error) {
        console.error('Email existence check failed:', error);
        return false; // Fail-safe: assume invalid if check fails
    }
};

export const makeRoomAvailable = async () => {
    cron.schedule('* * * * *', async () => {
        try {
            const [updatedRooms, deletedBookings] = await Promise.all([
                Room.updateMany(
                    {
                        status: 'Reserved',
                        reservedAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) }
                    },
                    { $set: { status: 'Available', reservedAt: null } }
                ),
                Booking.deleteMany({
                    status: 'Reserved',
                    reservedAt: { $lt: new Date(Date.now() - 10 * 60 * 1000) }
                })
            ]);
        } catch (error) {
            console.error('Room availability cron job failed:', error);
        }
    });
};