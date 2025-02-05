import { Router } from "express";

import {
    adduserLocation,
    getLocationByRoom,
    getLocationByUser,
    updateLocation
} from '../controllers/location.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';

const router = Router();

router.use(verifyAuth);

router.route('/add').post(adduserLocation);
//in room route use getLocationByRoom and in user route use getLocationByUser

export default router