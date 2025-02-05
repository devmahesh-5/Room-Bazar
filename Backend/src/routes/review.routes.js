import {Router} from "express";

import {
    addReview,
    deleteReview,
    getReviews,
    updateReview
} from '../controllers/review.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
const router = Router();

router.use(verifyAuth);

//review from room route

export default router