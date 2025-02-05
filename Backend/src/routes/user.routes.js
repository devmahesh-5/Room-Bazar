import { Router } from "express";

import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserPassword,
    updateUserProfile,
    deleteUser,
    refreshAccessToken
} from '../controllers/report.controllers.js';

import { verifyAuth } from '../middlewares/auth.middlewares.js';
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();
router.route('/register').post(//first thing controllers runs after user set data and click submit but using middleware, middleware runs (here files upload) and then only other data is got from user in controller
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

router.route('/refresh-token').post(
    refreshAccessToken
)

router.route('/change-password').post(
    verifyAuth,
    updateUserPassword
)

router.route('/myprofile').get(
    verifyAuth,
    getUserProfile
)

router.route('/updateprofile').patch(
    verifyAuth,
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
    updateUserProfile
)

router.route('/delete-account').delete(
    verifyAuth,
    deleteUser
)

export default router