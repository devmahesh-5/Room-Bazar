import {Router} from "express";

import {
   
    handleSuccess,
    handleFailure
} from '../controllers/payment.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);
//create payment from room route
// router.route()


export default router