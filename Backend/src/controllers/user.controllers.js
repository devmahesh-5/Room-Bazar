import mongoose, { isValidObjectId } from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteImageFromCloudinary } from "../utils/Cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { options } from '../constants.js';
import Location from "../models/location.models.js";
import Favourite from "../models/favourite.models.js";
import Room from "../models/room.models.js";
import Payment from "../models/payment.models.js";
import Refund from "../models/refund.models.js";
import { getRoommateByUserId, getUserByRoommateId,emailValidator } from "../constants.js";
import RoommateRequest from "../models/roommateRequest.models.js";
import { sendOtp, generateOtp,resetPasswordEmail } from "../constants.js";
import RoommateAccount from "../models/roommateAccount.models.js";
import {google} from 'googleapis';

const generateAccessAndRefreshTokens = async (userId) => {
   const user = await User.findById(userId);
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();
   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });
   return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {
   const { fullName, email, password, username, phone, address, gender, latitude, longitude } = req.body;
   if ([fullName, email, password, username, phone, address, gender].some((field) => !field || String(field.trim()) === '')) {
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
   const validEmail = await emailValidator(email);

   if (!validEmail) {
      throw new ApiError(400, 'Invalid email');
   }
   
   const avatarLocalPath = req.files?.avatar[0]?.path;
   const coverImagePath = req.files?.coverImage[0]?.path;

   if(!avatarLocalPath) {
      throw new ApiError(400, 'Avatar image is required');
   }

   const avatarCloudinaryPath = await uploadOnCloudinary(avatarLocalPath);
   let coverImageCloudinaryPath;
   if(coverImagePath){
      coverImageCloudinaryPath = await uploadOnCloudinary(coverImagePath);

      if(!coverImageCloudinaryPath) {
         throw new ApiError(500, 'Failed to upload cover image');
      }
   }
   
   if (!avatarCloudinaryPath) {
      throw new ApiError(500, 'Failed to upload avatar image');
   }

   const user = await User.create(
      {
         fullName,
         email,
         password,
         username,
         phone: phone.toString(),
         address,
         avatar: avatarCloudinaryPath?.secure_url || avatarCloudinaryPath?.url,
         coverImage: coverImageCloudinaryPath?.secure_url || coverImageCloudinaryPath?.url,
         gender,
      }
   );

   const otp = await generateOtp();

   const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);// 3 minutes
   if (!otp) {
      throw new ApiError(500, 'Failed to generate OTP');
   }

   const isVerified = await sendOtp(user.email, otp);

   if (!isVerified) {
      throw new ApiError(500, 'Failed to send OTP');
   }

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
            location: location._id,
            otp,
            otpExpiry
         }
      },
      {
         new: true
      }
   )

   if (!user) {
      throw new ApiError(500, 'Failed to create user');
   }
   const createdUser = await User.findById(user._id).select('-password -refreshToken -otp -otpExpiry -verificationAttempts -unVerified_at -is_verified -__v');
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

const verifyOtp = asyncHandler(async (req, res) => {
   const { otp, email } = req.body;
   if (!otp || !email) {
      throw new ApiError(400, 'OTP and email is required');
   }
   const user = await User.findOne({ email: email });

   if (!user) {
      throw new ApiError(500, 'User not found');
   }

   if(user.verificationAttempts >= 2){
      await User.findByIdAndDelete(user._id);
      await Location.findOneAndDelete({ user: user._id });
      throw new ApiError(400, 'Too many attempts please Register again');
   }

   if (user.otpExpiry < Date.now() || user.otp !== otp.toString()) {
      await User.findByIdAndUpdate(user._id, {
         $set: {
            is_verified: false,
            unVerified_at: Date.now(),
            verificationAttempts: user.verificationAttempts + 1
         }
       },
       {
         new: true
       });
      throw new ApiError(400, 'Invalid OTP');
   }

   const verifiedUser = await User.findOneAndUpdate(
      {
         otp: otp,
         email: email
      },
      {
         $set: {
            is_verified: true,
            verificationAttempts: 0,
            unVerified_at: null,
            otp: null
         }
      },
      {
         new: true
      }
   );

   if (!verifiedUser) {
      await User.findByIdAndUpdate(user._id, {
         $set: {
            is_verified: false
         }
       },
       {
         new: true
       });
      throw new ApiError(500, 'Failed to verify user');
   }

   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            verifiedUser,
            'User verified successfully'
         )
      )

})

const resendOtp = asyncHandler(async (req, res) => {
   const { email } = req.body;
   if (!email) {
      throw new ApiError(400, 'Email is required');
   }
   const user = await User.findOne({ email: email.email });

   if (!user) {
      throw new ApiError(500, 'User not found');
   }

   const otp = await generateOtp();

   const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);// 3 minutes
   if (!otp) {
      throw new ApiError(500, 'Failed to generate OTP');
   }

   const isVerified = await sendOtp(user.email, otp);
   if (!isVerified) {
      throw new ApiError(500, 'Failed to send OTP');
   }

   const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
         $set: {
            otp,
            otpExpiry
         }
      },
      {
         new: true
      }
   ).select('-password -refreshToken -otp');

   if (!updatedUser) {
      throw new ApiError(500, 'Failed to update user');
   }

   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            updatedUser,
            'OTP sent successfully'
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
   // const isVerified = user?.is_verified;
   
   // if (!isVerified) {
   //    throw new ApiError(400, 'User is not verified');
   // }

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
      .clearCookie('accessToken', options)
      .clearCookie('refreshToken', options)
      .json(
         new ApiResponse(
            200,
            null,
            'User logged out successfully'
         )
      )
});

const continueWithGoogle = asyncHandler(async (req, res) => {
      //create oauth url
      console.log(req.query.redirect_url);
      
      const oauth2Client = new google.auth.OAuth2(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          process.env.GOOGLE_CALLBACK_URI 
      );
  
      const url = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: [
              'profile',
              'email',
              'https://www.googleapis.com/auth/user.phonenumbers.read',
              'https://www.googleapis.com/auth/user.addresses.read',
              'https://www.googleapis.com/auth/user.gender.read'
          ],
          state: req.query.redirect_url || '/'
      });
  
      res.redirect(url);
});

const googleCallback = asyncHandler(async (req, res) => {
   
   const code = req.query.code;
   try {
      const oauth2Client = new google.auth.OAuth2(
         process.env.GOOGLE_CLIENT_ID,
         process.env.GOOGLE_CLIENT_SECRET,
         process.env.GOOGLE_CALLBACK_URI 
     );
   
     const { tokens } = await oauth2Client.getToken({
         code,
         redirect_uri: process.env.GOOGLE_CALLBACK_URI
     });
     oauth2Client.setCredentials(tokens);
   
     const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2'
   });
   const oauth2People = google.people({ version: 'v1', auth: oauth2Client });
   
   const { data:{id: googleId, email,picture, verified_email, name: fullName} } = await oauth2.userinfo.get();
   const {data:{phoneNumbers, addresses,genders}} = await oauth2People.people.get({
      resourceName: 'people/me',
      personFields: 'phoneNumbers,addresses,genders'
   
   });

   
   let user = await User.findOne(
      {
         $or: [
            { email },
            { googleId }
         ]
      }
   );
   
   if(!user){
      user = await User.create({
         fullName,
         username:email.split('@')[0],
         email,
         googleId,
         phone: phoneNumbers && phoneNumbers.length > 0 ? phoneNumbers[0].phoneNumber : null,
         address: addresses && addresses.length > 0 ? addresses[0].formattedAddress : null,
         avatar: picture,
         coverImage: null,
         is_verified: verified_email,
         gender: genders && genders.length > 0 ? genders[0].value : null
      });
   }else if(user){
      if(!user.googleId){
         user.googleId = googleId;
         await user.save({validateBeforeSave: false});
      }
   }
   
   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user?._id);
   res
      .status(200)
      .cookie('accessToken', accessToken, options)
      .cookie('refreshToken', refreshToken, options)
      .json(
         new ApiResponse(
            200,
            user,
            'User logged in successfully'
         )
      )
   
   res.send(`
  <html>
    <head>
      <script>
        // Wait a moment to ensure cookies are set
        setTimeout(function () {
          window.location.href = "${process.env.FRONTEND_URL}/users/oauth-callback";
        }, 500);
      </script>
    </head>
    <body>
      <p>Logging you in...</p>
    </body>
  </html>
`);
} catch (error) {
   console.log(error);
   throw new ApiError(500, error.message);
   // res.redirect(process.env.GOOGLE_REDIRECT_URL || '/rooms');
}

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
            location: 1,
            is_verified: 1,
            role: 1
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
   if ([fullName, email, phone, address].some((field) => !field || String(field).trim() === '')) {
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
   const deletedUser = await User.findByIdAndDelete(req.user?._id);
   const deletedRoommateAccount = await RoommateAccount.findOneAndDelete({ userId: req.user?._id });
   const deletedRoommateLocation = await Location.findOneAndDelete({ roommate: deletedRoommateAccount._id });
   const deletedUserLocation = await Location.findOneAndDelete({ user: req.user?._id });
   const deletedRoommateRequest = await RoommateRequest.deleteMany(
      {
         $or: [
            { sender: deletedRoommateAccount._id },
            { receiver: deletedRoommateAccount._id }
         ]
      }
   );
   if (!deletedUser) {
      throw new ApiError(500, "Failed to delete user");
   }
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
            avatar: profileCloudinaryPath?.secure_url || profileCloudinaryPath?.url
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
            coverImage: coverCloudinaryPath?.secure_url || coverCloudinaryPath?.url
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
   let userId;
   if (isValidObjectId(req.params?.roommateId)) {
      const user = await getUserByRoommateId(req.params?.roommateId);
      userId = user.userId;
   } else {
      userId = req.user?._id;
   }

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
            $group: {
               _id: null,
               rooms: {
                  $push: '$room'
               },
               totalRooms: {
                  $sum: 1
               }
            }
         }
      ]
   )

   const myRooms = await Room.aggregate(
      [
         {
            $match: {
               owner: userId
            }
         },
         {
            $lookup: {
               from: 'users',
               localField: 'owner',
               foreignField: '_id',
               as: 'owner',
               pipeline: [
                  {
                     $project: {
                        _id: 1,
                        fullName: 1,
                        email: 1,
                        phone: 1,
                        address: 1
                     }
                  },
               ]
            }
         },
         {
            $project: {
               _id: 1,
               name: 1,
               category: 1,
               price: 1,
               thumbnail: 1,
               rentPerMonth: 1,
               owner: { $arrayElemAt: ["$owner", 0] }
            }
         },
         {
            $group: {
               _id: null,
               rooms: {
                  $push: '$$ROOT'
               },
               totalRooms: {
                  $sum: 1
               }
            }
         }
      ]
   )

   const myPayments = await Payment.find({ userId })

   const requestedRefunds = await Refund.find({ userId })

   const myRoommateAccount = await getRoommateByUserId(userId);

   if (!myRoommateAccount) {
      throw new ApiError(404, 'Roommate not found');
   }

   const myRoommates = await RoommateRequest.aggregate(
      [
         {
            $match: {
               $or: [
                  { sender: myRoommateAccount._id },
                  { receiver: myRoommateAccount._id }
               ],
               status: 'Accepted'
            }

         },
         {
            $lookup: {
               from: 'roommateaccounts',
               localField: 'sender',
               foreignField: '_id',
               as: 'sender',
               pipeline: [
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
                     $addFields: {
                        user: { $arrayElemAt: ['$user', 0] }
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
               from: 'roommateaccounts',
               localField: 'receiver',
               foreignField: '_id',
               as: 'receiver',
               pipeline: [
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
                     $addFields: {
                        user: { $arrayElemAt: ['$user', 0] }
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
            $project: {
               myRoommates: {
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

   if (!myRoommates) {
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

const getUserIdByRoommateId = asyncHandler(async (req, res) => {
   const roommateId = req.params?.roommateId;

   if (!isValidObjectId(roommateId)) {
      throw new ApiError(400, 'Invalid roommate id');
   }

   const user = getRoommateByUserId(roommateId);
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

const sendForgetPasswordEmail = asyncHandler(async (req, res) => {
   const { email } = req.body;

   const user = await User.findOne({ email });
   if (!user) {
      throw new ApiError(404, 'User not found');
   }

   const otp = await generateOtp(true);
   if(!otp){
      throw new ApiError(500, 'Failed to generate OTP');
   }

   const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
   user.otp = otp;
   user.otpExpiry = otpExpiry;
   await user.save({ validateBeforeSave: false });
   await resetPasswordEmail(email, otp);
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            null,
            'OTP sent successfully'
         )
      )
})

const resetNewPassword = asyncHandler(async (req, res) => {
   const token = req.params?.token;
   const { password } = req.body;
   const user = await User.findOne({ otp: token });
   
   if (!user || user.otpExpiry < Date.now()) {
      throw new ApiError(404, 'Token expired or user not found');
   }

   user.password = password;
   user.otp = null;
   user.otpExpiry = null;
   await user.save();
   res
      .status(200)
      .json(
         new ApiResponse(
            200,
            null,
            'Password reset successfully'
         )
      )

});
export {
   registerUser,
   verifyOtp,
   resendOtp,
   loginUser,
   googleCallback,
   continueWithGoogle,
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
   getUserById,
   getUserIdByRoommateId,
   sendForgetPasswordEmail,
   resetNewPassword
};