import { Router } from "express";

import {
    toggleFavourite,
    getUserFavourites
} from '../controllers/favourite.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';

const router = Router();

router.use(verifyAuth);

router.route('/myfavourites').get(getUserFavourites);
router.route('/:roomId').post(toggleFavourite);
export default router