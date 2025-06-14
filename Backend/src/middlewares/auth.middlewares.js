import jwt from "jsonwebtoken";
import {ApiError} from "../utils/ApiError.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import User from "../models/user.models.js";
const verifyAuth = asyncHandler(async (req, res, next) => {
    //console.log(req.cookies);
    //  console.log(req.headers);
    
    const token = req.cookies.accessToken || req.headers.Authorization?.replace("Bearer ", "");
    console.log('token:',token);
    
    if (!token) {
        throw new ApiError(401, "User not authenticated");
    }
    try {
        const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if(!decodedToken){
            throw new ApiError(401, "User not authenticated");
        }
       
        const user = await User.findById(decodedToken?.id);
        if(!user){
            throw new ApiError(401, "User not authenticated");
        }

        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "User not authenticated");
    }
})

export {verifyAuth};