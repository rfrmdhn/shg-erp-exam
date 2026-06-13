import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/requireRole.middleware';
import { listVendors, createVendor, updateVendor, deleteVendor } from '../controllers/vendor.controller';
import { validateBody, validateQuery } from '../middleware/validate.middleware';
import { vendorCreateSchema, vendorUpdateSchema, vendorQuerySchema } from '../schemas/vendor.schema';

const router = Router();

router.get('/', authMiddleware, validateQuery(vendorQuerySchema), listVendors);
router.post('/', authMiddleware, requireRole('admin'), validateBody(vendorCreateSchema), createVendor);
router.put('/:id', authMiddleware, requireRole('admin'), validateBody(vendorUpdateSchema), updateVendor);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteVendor);

export default router;
