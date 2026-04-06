import { Router } from 'express';
import { tradeService } from '../services/tradeService';

const router = Router();

router.post('/', async (req, res) => {
  // Execute trade
});

router.get('/user/:userId', async (req, res) => {
  // Get user trades
});

export default router;
