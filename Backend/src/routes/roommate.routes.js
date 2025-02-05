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
    cancelRoommateRequest
} from '../controllers/roommate.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
const router = Router();

router.use(verifyAuth);

router.route('/register').post(registerRoommate);
router.route('/update/:roommateId').patch(updateRoommate);
router.route('/delete/:roommateId').delete(deleteRoommateAccount);
router.route('/roommates').get(getRoommates);
router.route('/search').get(searchRoomates);
router.route('/job/:job').get(getRoommateByJob);
router.route('/myroommate').get(getRoommateById);
router.route('/sendrequest/:roommateId').post(sendRoommateRequest);
router.route('/acceptrequest/:roommateId').patch(acceptRoommateRequest);
router.route('/rejectrequest/:roommateId').patch(rejectRoommateRequest);
router.route('/cancelrequest/:roommateId').patch(cancelRoommateRequest);
export default router