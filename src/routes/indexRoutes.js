import { Router } from 'express';
import categoryRouter from './categoryRoutes.js';
import customersRouter from './customersRoutes.js';
import gamesRouter from './gamesRoutes.js';

const router = Router();
router.use(categoryRouter);
router.use(gamesRouter)
router.use(customersRouter)
export default router;