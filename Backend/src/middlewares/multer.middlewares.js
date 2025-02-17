import multer from "multer";
import {v4 as uuidv4} from 'uuid';
import path from 'path';
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/temp');
    },
    filename: function (req, file, cb) {
        const uniqueName = uuidv4(); // Generate a UUID
        const ext = path.extname(file.originalname); // Get the file extension
        cb(null, uniqueName + ext)
    }
});

export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }
 });