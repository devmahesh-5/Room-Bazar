import { Router } from "express";

import {
    removeFromFavourites,
    getUserFavourites
} from '../controllers/favourite.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';

const router = Router();

router.use(verifyAuth);

router.route('/myfavourites').get(getUserFavourites);
router.route('/myfavourites/:favouriteId').delete(removeFromFavourites);

export default router