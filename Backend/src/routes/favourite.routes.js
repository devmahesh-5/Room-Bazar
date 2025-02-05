import { Router } from "express";

import {
    deleteFavourite,
    getUserFavourites
} from '../controllers/favourite.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';

const router = Router();

router.use(verifyAuth);

router.route('/myfavourites').get(getUserFavourites);
router.route('/myfavourites/:favouriteId').delete(deleteFavourite);

export default router