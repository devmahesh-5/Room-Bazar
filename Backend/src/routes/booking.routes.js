import { Router } from "express";

import {
    updateBooking,
    getAllBookings,
    getBookingsByUser
} from '../controllers/booking.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
const router = Router();

router.use(verifyAuth);

// router.route('/add/:roomId').post(addBooking);
router.route('/update/:id').patch(updateBooking);
router.route('/all').get(getAllBookings);
router.route('/myBookings').get(getBookingsByUser);
export default router;

