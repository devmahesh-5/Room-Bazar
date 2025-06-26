import {Router} from "express";

import {
    createMessage,
    getUserMessages,
    deleteMessage,
    getMessageProfile,
    getUnreadMessageCount
} from '../controllers/message.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
import {upload} from "../middlewares/multer.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);

router.route('/ib/:userId')
.post(
    upload.fields([
        {
            name:'messageFiles',
            maxCount:5
        }
    ]),
    createMessage
)
.get(getUserMessages)
router.route('/').get(getMessageProfile);
router.route('/ib/:userId/:messageId').delete(deleteMessage);
router.route('/unread').get(getUnreadMessageCount);
export default router