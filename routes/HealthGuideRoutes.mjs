import express from 'express';
import { getHealthGuide } from '../controllers/healthGuide.mjs';

const router = express.Router();

router.get('/', getHealthGuide);

export default router;
