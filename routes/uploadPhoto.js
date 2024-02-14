import express from 'express';
import upload from '../middelware/multer.js';
import uploadPhoto from '../controllers/uploadPhoto/uploadPhoto.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadPhoto);

export default router;
