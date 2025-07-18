import { Router } from "express";
import {rateLimit} from 'express-rate-limit'
import {
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
    resetNewPassword,
    sendForgetPasswordEmail,
    afterGoogleLogin
} from '../controllers/user.controllers.js';

import { getLocationByUser,updateUserLocation } from '../controllers/location.controllers.js';

import { addOwnerReport, getOwnerReport } from "../controllers/report.controllers.js";

import { verifyAuth } from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

const loginLimiter = rateLimit({
    windowMs:  3* 60 * 1000,
    max: 5,
    message: "Too many login attempts from this IP, please try again after 3 minutes"
})
router.route('/register').post(
    loginLimiter,
    upload.fields([
        {
            name: 'avatar',
            maxCount: 1
        },
        {
            name: 'coverImage',
            maxCount: 1
        }
    ]),
    registerUser
)

router.route('/verify-otp').post(verifyOtp)

router.route('/resend-otp').post(resendOtp);

router.route('/login').post(
    loginLimiter,
    loginUser
)
//google login
router.route('/oauth-callback').get(verifyAuth,getUserProfile)
router.route('/auth/google/my-google-profile').get(googleCallback);
router.route('/auth/google').get(continueWithGoogle);
router.route('/auth/google/login').post(afterGoogleLogin);
router.route('/forgot-password').post(
    sendForgetPasswordEmail
);

router.route('/reset-password/:token').post(
    resetNewPassword
)

//secured routes
router.route('/logout').post(
    verifyAuth,
    logoutUser
)

router.route('/dashboard/:roommateId').get(
    verifyAuth,
    checkVerified,
    getDashboard
)

router.route('/get-my-dashboard').get(
    verifyAuth,
    getDashboard
)

router.route('/refresh-token').post(
    refreshAccessToken
)

router.route('/change-password').patch(
    verifyAuth,
    checkVerified,
    updateUserPassword
)

router.route('/myprofile').get(
    verifyAuth,
    getUserProfile
)

router.route('/getroommatesuserid/:roommateId').get(
    verifyAuth,
    checkVerified,
    getUserIdByRoommateId
)


router.route('/:userId').get(
    verifyAuth,
    checkVerified,
    getUserById
)

router.route('/myfavourites').get(  
    verifyAuth,
    getUserFavourites
)

router.route('/updateprofile').patch(
    verifyAuth,
    checkVerified,
    updateUserProfile
)

router.route('/delete-account').delete(
    verifyAuth,
    checkVerified,
    deleteUser
)

router.route('/updateprofilepicture').patch(
    verifyAuth,
    checkVerified,
    upload.single('avatar'),
    updateProfilePicture
)

router.route('/updatecoverpicture').patch(
    verifyAuth,
    checkVerified,
    upload.single('coverImage'),
    updateCoverPicture
)

router.route('/mylocation').get(
    verifyAuth,
    checkVerified,
    getLocationByUser
)

router.route('/addreport/:ownerId').post(
    verifyAuth,
    checkVerified,
    addOwnerReport
)

router.route('/reports/:ownerId').get(
    verifyAuth,
    checkVerified,
    getOwnerReport
)

//location
router.route('/updatelocation').patch(
    verifyAuth,
    checkVerified,
    updateUserLocation
)


export default router