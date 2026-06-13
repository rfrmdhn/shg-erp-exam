import { Router } from 'express';
import authRoutes from './auth.routes';
import unitRoutes from './unit.routes';
import vendorRoutes from './vendor.routes';

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok' }));
router.use('/auth', authRoutes);
router.use('/units', unitRoutes);
router.use('/vendors', vendorRoutes);

export default router;
