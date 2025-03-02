import { Router } from "express";
import {
    createRoom,
    getRoomById,
    updateRoom,
    deleteRoom,
    getAllRooms,
    searchRooms,
    getRoomsByCategory,
    getRoomsByLocation
} from '../controllers/room.controllers.js';

import { toggleFavourite, getFavouriteByRoomId } from '../controllers/favourite.controllers.js';
import { updateRoomLocation } from "../controllers/location.controllers.js";
import { addBooking } from "../controllers/booking.controllers.js";
import { createRefund } from "../controllers/refund.controllers.js";

import { addRoomReport, getRoomReport } from '../controllers/report.controllers.js';

import {
    addReview,
    deleteReview,
    getReviews,
    updateReview
} from '../controllers/review.controllers.js';

import { verifyAuth } from '../middlewares/auth.middlewares.js';
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.use(verifyAuth);

router.route('/add').post(
    upload.fields([
        {
            name: 'thumbnail',
            maxCount: 1
        },
        {
            name: 'roomPhotos',
            maxCount: 5
        },
        {
            name: 'video',
            maxCount: 1,
            type: 'video/mp4'
        }
    ]),
    createRoom
);
router.route('/update/:roomId').patch(
    upload.fields([
        {
            name: 'thumbnail',
            maxCount: 1
        },
        {
            name: 'roomPhotos',
            maxCount: 5
        }
    ]),
    updateRoom
);
router.route('/delete/:roomId').delete(deleteRoom);
router.route('/').get(getAllRooms);
router.route('/search').get(searchRooms);
router.route('/category/:category').get(getRoomsByCategory);
router.route('/location/:location').get(getRoomsByLocation);
router.route('/:roomId').get(getRoomById).post(toggleFavourite);
router.route('/favourites/:roomId').get(getFavouriteByRoomId);
//location route

router.route('/location/:roomId').patch(updateRoomLocation);


//Booking route
router.route('/booking/:roomId').post(addBooking);

//refund route
router.route('/refund/:roomId').post(createRefund);

//report route
router.route('/addreport/:roomId').post(addRoomReport);
router.route('/reports/:roomId').get(getRoomReport);

//review route
router.route('/reviews/:roomId')
    .post(addReview)
    .get(getReviews);

router.route('/reviews/:roomId/:reviewId')
    .delete(deleteReview)
    .patch(updateReview);
export default router