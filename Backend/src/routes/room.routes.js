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

import { addFavourite } from '../controllers/favourite.controllers.js';
import { getLocationByRoom, updateLocation } from "../controllers/location.controllers.js";
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
router.route('/allrooms').get(getAllRooms);
router.route('/search').get(searchRooms);
router.route('/category/:category').get(getRoomsByCategory);
router.route('/location/:location').get(getRoomsByLocation);
router.route('/:roomId').get(getRoomById).post(addFavourite);

//location route

router.route('/location/:roomId').get(getLocationByRoom).patch(updateLocation);


//Booking route
router.route('/booking/:roomId').post(addBooking);

//refund route
router.route('/refund/:roomId').post(createRefund);

//report route
router.route('/addreport/:roomId').post(addRoomReport);
router.route('/getreports/:roomId').get(getRoomReport);

//review route
router.route('/reviews/:roomId').post(addReview).
    delete(deleteReview).
    get(getReviews).
    patch(updateReview);

export default router