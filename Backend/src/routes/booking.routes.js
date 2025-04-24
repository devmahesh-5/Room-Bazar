import { Router } from "express";

import {
    updateBooking,
    getAllBookings,
    getBookingsByUser
} from '../controllers/booking.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);

// router.route('/add/:roomId').post(addBooking);
router.route('/checkin/:id').patch(updateBooking);
router.route('/all').get(getAllBookings);
router.route('/my-bookings').get(getBookingsByUser);
export default router;

