import User from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";

const checkVerified = asyncHandler(async (req, res, next) => {
    try {
        const user = req.user;
        if (!user?.is_verified) {
          throw new ApiError(401, "User not verified");
        }
        next();
    } catch (error) {
        throw new ApiError(401, "User not verified");
    }
  });

  export {checkVerified};