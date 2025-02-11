import {Router} from "express";

import {
    createMessage,
    getUserMessages,
    deleteMessage,
    getMessageProfile
} from '../controllers/message.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import {upload} from "../middlewares/multer.middlewares.js";
const router = Router();

router.use(verifyAuth);

router.route('/:userId')
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

export default router