import {Router} from "express";

import {
    createPayment,
    handleEsewaSuccess,
    handleKhaltiSuccess
} from '../controllers/payment.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);
//create payment from room route
router.route('/:roomId').post(createPayment);
router.route('/khalti/success/:paymentId').get(handleKhaltiSuccess);
router.route('/esewa/success/:paymentId').get(handleEsewaSuccess);
export default router