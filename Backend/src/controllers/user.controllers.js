import mongoose, { isValidObjectId } from "mongoose";
import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import uploadOnCloudinary, { deleteImageFromCloudinary } from "../utils/Cloudinary.js";
import {ApiError} from "../utils/ApiError.js";
import {options} from '../constants.js';

const generateAccessAndRefreshTokens = async (userId) => {
   const user = await User.findById(userId);
   const accessToken = user.generateAccessToken();
   const refreshToken = user.generateRefreshToken();
   user.refreshToken = refreshToken;
   await user.save({ validateBeforeSave: false });
   return { accessToken, refreshToken };
}

const registerUser = asyncHandler(async (req, res) => {
   const { fullName, email, password, username, phone, address } = req.body;
   if ([fullName, email, password, username, phone, address].some((field) => !field || field.trim() === '')) {
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
         phone,
         address,
         avatar: avatarCloudinaryPath?.url,
         coverImage: coverImageCloudinaryPath?.url
      }
   );

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
   const user = await User.findById(userId).select('-password -refreshToken');
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
   const refreshToken = req.cookies.refreshToken;
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

export {
   registerUser,
   loginUser,
   logoutUser,
   getUserProfile,
   updateUserPassword,
   updateUserProfile,
   deleteUser,
   refreshAccessToken
};