import crypto from "crypto";
import mongoose from "mongoose";
import RoommateAccount from "./models/roommateAccount.models.js";
export const DB_NAME="Room-Bazar";

export const options ={
    httpOnly: true,
    secure : true
}//this ensures that cookie is not modifiable from frontend

export const generateSignature = (dataToSign) => {
    const signature = crypto.createHmac('sha512', process.env.ESEWA_SECRET_KEY).update(dataToSign)
        .digest('base64');
    return signature;
};

export const getRoommateByUserId = async(userId) => {

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
                $addFields: {
                    user: { $arrayElemAt: ['$user', 0] },
                }
            },
            {
             $project: {
                 _id: 1,
                 user: 1
             }   
            }
        ]
    );

    return roommate[0];
}