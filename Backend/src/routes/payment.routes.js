import {Router} from "express";

import {
    createPayment,
    handleSuccess,
    handleFailure,
    handleKhaltiSuccess
} from '../controllers/payment.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);
//create payment from room route
router.route('/:roomId').post(createPayment);
router.route('/khalti/success/:paymentId').get(handleKhaltiSuccess);

export default router