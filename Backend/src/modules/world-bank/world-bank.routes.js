import express from 'express';
import { WorldBankController } from './world-bank.controller.js';

const router = express.Router();


router.get('/indicators/:indicatorCode', WorldBankController.getIndicator);

export default router;
