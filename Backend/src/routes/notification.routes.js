import {Router} from "express";

import {
    getNotificationsByReceiver
} from '../controllers/notification.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);

router.route('/').get(getNotificationsByReceiver);

export default router