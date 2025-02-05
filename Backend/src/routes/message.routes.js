import {Router} from "express";

import {
    createMessage,
    getUserMessages,
    deleteMessage,
    getMessageProfile
} from '../controllers/message.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';

const router = Router();

router.use(verifyAuth);

router.route('/:userId')
.post(createMessage)
.get(getUserMessages)
router.route('/').get(getMessageProfile);
router.route('/:userId/inboxmessages/:messageid').delete(deleteMessage);

export default router