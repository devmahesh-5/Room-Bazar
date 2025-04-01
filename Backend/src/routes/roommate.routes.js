import {Router} from "express";

import {
    registerRoommate,
    updateRoommate,
    getRoommates,
    getRoommateById,
    deleteRoommateAccount,
    searchRoomates,
    getRoommateByJob,
    sendRoommateRequest,
    acceptRoommateRequest,
    rejectRoommateRequest,
    cancelRoommateRequest,
    getMyRoommates,
    getMyRoommateAccount,
    getNonRoommates,
    getSentRoommateRequest,
    getReceivedRoommateRequest,

} from '../controllers/roommate.controllers.js';

import { upload } from "../middlewares/multer.middlewares.js";
import {verifyAuth} from '../middlewares/auth.middlewares.js';
const router = Router();

router.use(verifyAuth); 

router.route('/register').post(
    upload.fields([
        {
            name: 'roomPhotos',
            maxCount: 5
        }
    ]),
    registerRoommate
);
router.route('/update-account').patch(updateRoommate);
router.route('/delete-account').delete(deleteRoommateAccount);
router.route('/non-roommates').get(getNonRoommates);
router.route('/').get(getRoommates);
router.route('/search').get(searchRoomates);
router.route('/job').get(getRoommateByJob);
router.route('/profile/:roommateId').get(getRoommateById);
router.route('/my-roommates').get(getMyRoommates);
router.route('/myprofile').get(getMyRoommateAccount);
router.route('/sentrequests').get(getSentRoommateRequest);
router.route('/receivedrequests').get(getReceivedRoommateRequest);
//requests route

router.route('/sendrequest/:roommateId').post(sendRoommateRequest);
router.route('/acceptrequest/:roommateId').patch(acceptRoommateRequest);
router.route('/rejectrequest/:roommateId').patch(rejectRoommateRequest);
router.route('/cancelrequest/:roommateId').delete(cancelRoommateRequest);
export default router