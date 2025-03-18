import express from 'express';
import { Uploadfile, CheckUpload } from '../../controllers/UploadController/UploadController.js';

const router = express.Router();

router.post('/uploadfile', Uploadfile);
router.get('/check', CheckUpload);

export default router;