import { Router } from "express";

import {
    adduserLocation
    
} from '../controllers/location.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';

const router = Router();

router.use(verifyAuth);

export default router