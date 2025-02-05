import {Router} from "express";

import {
    addRoomReport,
    addOwnerReport,
    getAllReports,
    getRoomReport,
    getOwnerReport
} from '../controllers/report.controllers.js';

import {verifyAuth} from '../middlewares/auth.middlewares.js';
import { upload } from "../middlewares/multer.middlewares.js";
const router = Router();

router.use(verifyAuth);


export default router