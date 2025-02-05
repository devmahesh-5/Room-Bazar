import {Router} from "express";

import {
    createRefund,
    updateRefund,
    getRefundByUser,
    getAllRefunds,
    rejectRefund,
    getRefundByStatus
} from '../controllers/refund.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.use(verifyAuth);
//create refund from room route

router.route('/:refundId').patch(updateRefund);
router.route('/myrefundrequests').get(getRefundByUser);
router.route('/allrefunds').get(getAllRefunds);
router.route('/reject/:refundId').patch(
    upload.fields([
        { name: 'ownerRejectionPhotos', maxCount: 5 },
    ]),
    rejectRefund
);

router.route('/:status').get(getRefundByStatus);

export default router