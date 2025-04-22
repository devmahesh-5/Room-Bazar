import { Router } from "express";

import {
    registerUser,
    verifyOtp,
    resendOtp,
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
    getUserById,
    getUserIdByRoommateId
} from '../controllers/user.controllers.js';

import { getLocationByUser,updateUserLocation } from '../controllers/location.controllers.js';

import { addOwnerReport, getOwnerReport } from "../controllers/report.controllers.js";

import { verifyAuth } from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();



router.route('/register').post(
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
    loginUser
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
    checkVerified,
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
    checkVerified,
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
    checkVerified,
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