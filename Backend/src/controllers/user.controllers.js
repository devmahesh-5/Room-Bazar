import mongoose, { isValidObjectId } from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteImageFromCloudinary } from "../utils/Cloudinary.js";
import {ApiError} from "../utils/ApiError.js";
import {options} from '../constants.js';
import Location from "../models/location.models.js";
import Favourite from "../models/favourite.models.js";
import Room from "../models/room.models.js";
import Payment from "../models/payment.models.js";
import Refund from "../models/refund.models.js";
import { getRoommateByUserId } from "../constants.js";
import RoommateRequest from "../models/roommateRequest.models.js";
const generateAccessAndRefreshTokens = async (userId) => {
   const user = await User.findById(userId);
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();
   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });
   return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {
   const { fullName, email, password, username, phone, address, gender,latitude,longitude } = req.body;
   if ([fullName, email, password, username, phone, address, gender].some((field) => !field || field.trim() === '')) {
      throw new ApiError(400, 'All fields are required');
   }
   
   const existingUser = await User.findOne({
      $or: [
         { email },
         { username }
      ]
   });

   if (existingUser) {
      throw new ApiError(400, 'User already exists');
   }

   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImagePath = req.files?.coverImage[0]?.path;
   
   const avatarCloudinaryPath = await uploadOnCloudinary(avatarLocalPath);
   const coverImageCloudinaryPath = await uploadOnCloudinary(coverImagePath);

   if (!avatarCloudinaryPath || !coverImageCloudinaryPath) {
      throw new ApiError(500, 'Failed to upload image');
   }
   const user = await User.create(
      {
         fullName,
         email,
         password,
         username,
         phone: phone.toString(),
         address,
         avatar: avatarCloudinaryPath?.url,
         coverImage: coverImageCloudinaryPath?.url,
         gender
      }
   );
   const location = await Location.create({
      latitude,
      longitude,
      address,
      user: user._id
   })

   if (!location) {
      throw new ApiError(500, 'Failed to add location');
   }

   await User.findByIdAndUpdate(
      user._id,
      {
         $set: {
            location: location._id
         }
      },
      {
         new: true
      }
   )

   if (!user) {
      throw new ApiError(500, 'Failed to create user');
   }
   const createdUser = await User.findById(user._id).select('-password -refreshToken');
   res
      .status(201)
      .json(
         new ApiResponse(
            201,
            createdUser,
            'User created successfully'
         )
      )
});

const loginUser = asyncHandler(async (req, res) => {
   const { email, username, password } = req.body;
   if (!email && !username) {
      throw new ApiError(400, 'Email or username is required');
   }
   if (!password) {
      throw new ApiError(400, 'Password is required');
   }

   const user = await User.findOne(
      {
         $or: [
            { email },
            { username }
         ]
      }
   );

   if (!user) {
      throw new ApiError(404, 'User not found');
   }

   const isPasswordCorrect = await user.isPasswordCorrect(password);
   if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid password');
   }

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

   const loggedInUser = await User.findById(user._id).select('-password -refreshToken');
   res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
         new ApiResponse(
            200,
            loggedInUser,
            'User logged in successfully'
         )
      )


});

const logoutUser = asyncHandler(async (req, res) => {
   const userid = req.user?._id;
   if (!isValidObjectId(userid)) {
      throw new ApiError(400, 'Invalid user id');
   }
   const user = await User.findById(userid);
   if (!user) {
      throw new ApiError(404, 'User not found');
   }
   user.refreshToken = null;
   await user.save({ validateBeforeSave: false });
   res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json(
         new ApiResponse(
            200,
            null,
            'User logged out successfully'
         )
      )
});

const getUserProfile = asyncHandler(async (req, res) => {
   const userId = req.user?._id;
   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }
   const user = await User.aggregate([
      {
         $match: {
            _id: new mongoose.Types.ObjectId(userId)
         }
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
                     user: 0
                  }
               },
            ]
         }
      },
      {
         $addFields: {
            location: { $arrayElemAt: ['$location', 0] }
         }
      },
      {
         $project: {
            _id: 1,
            fullName: 1,
            email: 1,
            phone: 1,
            address: 1,
            avatar: 1,
            coverImage: 1,
            gender: 1,
            location: 1
         }
      }
   ]);
   if (!user) {
      throw new ApiError(404, 'User not found');
   }
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            user,
            'User profile fetched successfully'
         )
      )
});

const updateUserPassword = asyncHandler(async (req, res) => {
   const { oldPassword, newPassword } = req.body;
   if (!oldPassword || !newPassword) {
      throw new ApiError(400, 'All fields are required');
   }

   const userId = req.user?._id;
   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }
   const user = await User.findById(userId);
   if (!user) {
      throw new ApiError(404, 'User not found');
   }

   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
   if (!isPasswordCorrect) {
      throw new ApiError(401, 'Invalid password');
   }

   user.password = newPassword;
   await user.save({ validateBeforeSave: false });
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            null,
            'User password updated successfully'
         )
      )
});

const updateUserProfile = asyncHandler(async (req, res) => {
   const { fullName, email, phone, address } = req.body;

   if ([fullName, email, phone, address].some((field) => !field || field.trim() === '')) {
      throw new ApiError(400, 'All fields are required');
   }
   const userId = req.user?._id;
   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }
   const updatedUser = await User.findByIdAndUpdate(userId,
      {
         $set: {
            fullName,
            email,
            phone,
            address
         }
      },
      { new: true }
   )
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            updatedUser,
            'User profile updated successfully'
         )
      )
});

const deleteUser = asyncHandler(async (req, res) => {
   await User.findByIdAndDelete(req.user?._id);
   res
      .status(200)
      .clearCookie('accessToken')
      .clearCookie('refreshToken')
      .json(
         new ApiResponse(
            200,
            null,
            'User deleted successfully'
         )
      )
});

const refreshAccessToken = asyncHandler(async (req, res) => {
   const refreshToken = req.cookies.refreshToken || req.headers.authorization.replace("Bearer ", "");
   // console.log(refreshToken);
   
   if (!refreshToken) {
      throw new ApiError(401, 'User not authenticated');
   }
   const user = await User.findOne({ refreshToken });
   if (!user) {
      throw new ApiError(401, 'User not authenticated');
   }
   if (user.refreshToken !== refreshToken) {
      throw new ApiError(401, 'User Session Expired');
   }
   const { accessToken, refreshToken: newRefreshToken } = await generateAccessAndRefreshTokens(user._id);

   if (!accessToken || !newRefreshToken) {
      throw new ApiError(500, "could not generate tokens");
   }
   res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', newRefreshToken, options)
      .json(
         new ApiResponse(
            200,
            null,
            'Access token refreshed successfully'
         )
      )
});

const updateProfilePicture = asyncHandler(async (req, res) => {
   const userId = req.user?._id;
   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }
   const user = await User.findById(userId);
   if (!user) {
      throw new ApiError(404, 'User not found');
   }
   const profileLocalPath = req.file?.path;

   if (!profileLocalPath) {
      throw new ApiError(400, 'Profile picture is required');
   }

   const profileCloudinaryPath = await uploadOnCloudinary(profileLocalPath);
  
   
   const oldAvatarPublicId = user.avatar.split('/').pop().split('.')[0];
   
   
   if (!profileCloudinaryPath) {
      throw new ApiError(500, 'Error uploading profile picture');
   }

   
   
   const updatedUser = await User.findByIdAndUpdate(userId,
      {
         $set: {
            avatar: profileCloudinaryPath?.url
         }
      },
      { new: true }
   )
   if (!updatedUser) {
      throw new ApiError(500, 'Error updating profile picture');
   }

   await deleteImageFromCloudinary(oldAvatarPublicId);

   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            user,
            'Profile picture updated successfully'
         )
      )
  
});

const updateCoverPicture = asyncHandler(async (req, res) => {
   const userId = req.user?._id;
   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }
   const user = await User.findById(userId);
   if (!user) {
      throw new ApiError(404, 'User not found');
   }
   const coverLocalPath = req.file?.path;

   if (!coverLocalPath) {
      throw new ApiError(400, 'Cover picture is required');
   }

   const coverCloudinaryPath = await uploadOnCloudinary(coverLocalPath);   
   const oldCoverPublicId = user.coverImage.split('/').pop().split('.')[0];

   if (!coverCloudinaryPath) {
      throw new ApiError(500, 'Error uploading cover picture');
   }

  

   const updatedUser = await User.findByIdAndUpdate(userId,
      {
         $set: {
            coverImage: coverCloudinaryPath?.url
         }
      },
      { new: true }
   )
   if (!updatedUser) {
      throw new ApiError(500, 'Error updating cover picture');
   }
    await deleteImageFromCloudinary(oldCoverPublicId);
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            user,
            'Cover picture updated successfully'
         )
      )
  
});

const getUserFavourites = asyncHandler(async (req, res) => {
   const userId = req.user?._id;
   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }
   const favourites = await Favourite.aggregate(
      [
         {
            $match: {
               userId
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
                        description: 1,
                        category: 1,
                        location: 1,
                        owner: 1,
                        price: 1,
                        rating: 1,
                        thumbnail: 1,

                     }
                  }
               ]
            }
         },
         {
            $project: {
               room: { $arrayElemAt: ["$room", 0] }
            }
         }
      ]
   )
   if (!favourites) {
      throw new ApiError(404, 'User favourites not found');
   }
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            favourites,
            'User favourites fetched successfully'
         )
      )
});

const getDashboard = asyncHandler(async (req, res) => {
   const userId = req.user?._id;

   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }

   const favourites = await Favourite.aggregate(
      [
         {
            $match: {
               userId
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
                        description: 1,
                        category: 1,
                        location: 1,
                        owner: 1,
                        price: 1,
                        rating: 1,
                        thumbnail: 1,
                     }
                  }
               ]
            }
         },

         {
            $group :{
               _id : null,
               rooms : {
                  $push : '$room'
               },
               totalRooms : {
                  $sum : 1
               }
            }
         }
      ]
   )

   const myRooms = await Room.aggregate(
      [
         {
            $match : {
               owner : userId
            }
         },
         {
            $project : {
               _id : 1,
               name : 1,
               category : 1,
               price : 1,
               thumbnail : 1,
               rentPerMonth : 1
            }
         },
         {
            $group : {
               _id : null,
               rooms : {
                  $push : '$$ROOT'
               },
               totalRooms : {
                  $sum : 1
               }
            }
         }
      ]
   )

   const myPayments = await Payment.find({ userId })

   const requestedRefunds = await Refund.find({ userId })

   const myRoommateAccount = await getRoommateByUserId(userId);

    if(!myRoommateAccount){
        throw new ApiError(404, 'Roommate not found');
    }
    
    const myRoommates = await RoommateRequest.aggregate(
        [
            {
                $match:{
                   $or:[
                        {sender: myRoommateAccount._id},
                        {receiver: myRoommateAccount._id}
                    ],
                    status:'Accepted'
                }
                
                },
            {
                $lookup: {
                    from : 'roommateaccounts',
                    localField : 'sender',
                    foreignField : '_id',
                    as : 'sender',
                    pipeline: [
                        {
                            $lookup:{
                                from : 'users',
                                localField : 'userId',
                                foreignField : '_id',
                                as : 'user',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            fullName: 1,
                                            email: 1,
                                            phone: 1,
                                            address: 1,
                                            avatar: 1,
                                            gender: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                user:{$arrayElemAt:['$user',0]}
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                user: 1,
                                job: 1,
                                smoking: 1,
                                pets: 1,
                            }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from : 'roommateaccounts',
                    localField : 'receiver',
                    foreignField : '_id',
                    as : 'receiver',
                    pipeline: [
                        {
                            $lookup:{
                                from : 'users',
                                localField : 'userId',
                                foreignField : '_id',
                                as : 'user',
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 1,
                                            fullName: 1,
                                            email: 1,
                                            phone: 1,
                                            address: 1,
                                            avatar: 1,
                                            gender: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                user:{$arrayElemAt:['$user',0]}
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                user: 1,
                                job: 1,
                                smoking: 1,
                                pets: 1,
                        }
                        }
                    ]
                }         
            },
            {
                $addFields: {
                    sender: { $arrayElemAt: ['$sender', 0] },
                    receiver: { $arrayElemAt: ['$receiver', 0] }
                }
            },
            // {
            //    sort: {
            //       createdAt: -1
            //    }
            // },
            // {
            //    limit: 6//check functionality later
            // },
            {
                $project:{
                    myRoommates:{
                        $cond: {
                            if: { $eq: ["$sender._id", myRoommateAccount._id] },
                            then: "$receiver",
                            else: "$sender"
                        }
                    }
                }
            }
        ]
    )
    
    if(!myRoommates){
        throw new ApiError(404, 'Roommates not found');
    }

   const dashboard = {
      myRooms,
      favourites,
      myPayments,
      requestedRefunds,
      myRoommates
   }
   if (!dashboard) {
      throw new ApiError(404, 'Dashboard not found');
   }

   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            dashboard,
            'Dashboard fetched successfully'
         )
      )
})

const getUserById = asyncHandler(async (req, res) => {
   const userId = req.params?.userId;

   if (!isValidObjectId(userId)) {
      throw new ApiError(400, 'Invalid user id');
   }

   const user = await User.findById(userId).select('-password -refreshToken -role');
   if (!user) {
      throw new ApiError(404, 'User not found');
   }
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            user,
            'User fetched successfully'
         )
      )
})
export {
   registerUser,
   loginUser,
   logoutUser,
   getUserProfile,
   updateUserPassword,
   updateUserProfile,
   deleteUser,
   refreshAccessToken,
   updateProfilePicture,
   updateCoverPicture,
   getUserFavourites,
   getDashboard,
   getUserById
};