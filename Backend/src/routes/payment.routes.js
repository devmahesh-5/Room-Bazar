import {Router} from "express";

import {
   
    handleSuccess,
    handleFailure
} from '../controllers/payment.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';

const router = Router();

router.use(verifyAuth);
//create payment from room route
// router.route()


export default router