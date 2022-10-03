import { Router } from 'express';
import categoryRouter from './categoryRoutes.js';
import gamesRouter from './gamesRoutes.js';

const router = Router();
router.use(categoryRouter);
router.use(gamesRouter)

export default router;