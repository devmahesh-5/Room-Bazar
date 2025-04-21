import { Router } from "express";

import {
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
    getUserById,
    getUserIdByRoommateId
} from '../controllers/user.controllers.js';

import { getLocationByUser,updateUserLocation } from '../controllers/location.controllers.js';

import { addOwnerReport, getOwnerReport } from "../controllers/report.controllers.js";

import { verifyAuth } from '../middlewares/auth.middlewares.js';
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

router.route('/login').post(loginUser)

//secured routes
router.route('/logout').post(
    verifyAuth,
    logoutUser
)

router.route('/dashboard/:roommateId').get(
    verifyAuth,
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
    updateUserPassword
)

router.route('/myprofile').get(
    verifyAuth,
    getUserProfile
)

router.route('/getroommatesuserid/:roommateId').get(
    verifyAuth,
    getUserIdByRoommateId
)


router.route('/:userId').get(
    verifyAuth,
    getUserById
)

router.route('/myfavourites').get(  
    verifyAuth,
    getUserFavourites
)

router.route('/updateprofile').patch(
    verifyAuth,
    updateUserProfile
)

router.route('/delete-account').delete(
    verifyAuth,
    deleteUser
)

router.route('/updateprofilepicture').patch(
    verifyAuth,
    upload.single('avatar'),
    updateProfilePicture
)

router.route('/updatecoverpicture').patch(
    verifyAuth,
    upload.single('coverImage'),
    updateCoverPicture
)

router.route('/mylocation').get(
    verifyAuth,
    getLocationByUser
)

router.route('/addreport/:ownerId').post(
    verifyAuth,
    addOwnerReport
)

router.route('/reports/:ownerId').get(
    verifyAuth,
    getOwnerReport
)

//location
router.route('/updatelocation').patch(
    verifyAuth,
    updateUserLocation
)


export default router