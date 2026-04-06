import { Router } from 'express';
import { marketService } from '../services/marketService';

const router = Router();

router.get('/', async (req, res) => {
  // Get all markets
});

router.get('/:id', async (req, res) => {
  // Get market by ID
});

export default router;
