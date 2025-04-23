import { Router } from "express";

import {
    toggleFavourite,
    getUserFavourites
} from '../controllers/favourite.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { checkVerified } from "../middlewares/checkVerify.middlewares.js";
const router = Router();

router.use(verifyAuth,checkVerified);

router.route('/myfavourites').get(getUserFavourites);
router.route('/:roomId').post(toggleFavourite);
export default router