import crypto from "crypto";
import mongoose from "mongoose";
import RoommateAccount from "./models/roommateAccount.models.js";
import otpGenerator from "otp-generator";
import nodemailer from "nodemailer";
import corn from "node-cron";
export const DB_NAME = "Room-Bazar";

export const options = {
    httpOnly: true,
    secure: true
}//this ensures that cookie is not modifiable from frontend

export const generateSignature = (dataToSign) => {
    const signature = crypto.createHmac('sha512', process.env.ESEWA_SECRET_KEY).update(dataToSign)
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
            <strong>Important:</strong> This code expires in 5 minutes. Do not share it with anyone.
          </p>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;">
          
          <p style="font-size: 14px; color: #999; text-align: center;">
            If you didn't request this email, please ignore it or contact our support team at 
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
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { subject, text, html } = otpEmailTemplate(otp);

    try {
        await transporter.sendMail({
            from: `Room-Bazar <${process.env.EMAIL}>`,
            to: email,
            subject,
            text,
            html
        });
        return true
    } catch (error) {
        console.error('Error sending OTP:', error);
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

export const unVerifiedUserRemoval = async () => {
    cron.schedule('0 3 * * *', async () => {
        await User.deleteMany({ 
          is_verified: false,
          unVerified_at: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
        });
      });
}