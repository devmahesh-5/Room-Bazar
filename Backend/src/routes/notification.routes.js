import {Router} from "express";

import {
    getNotificationsByReceiver,
    markReadNotifications

} from '../controllers/notification.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);

router.route('/').get(getNotificationsByReceiver);
router.route('/markasread').post(verifyAuth,getNotificationsByReceiver);
export default router