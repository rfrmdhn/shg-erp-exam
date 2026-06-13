import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/requireRole.middleware';
import { listUnits, createUnit, updateUnit, deleteUnit } from '../controllers/unit.controller';
import { validateBody } from '../middleware/validate.middleware';
import { unitBodySchema } from '../schemas/unit.schema';

const router = Router();

router.get('/', authMiddleware, listUnits);
router.post('/', authMiddleware, requireRole('admin'), validateBody(unitBodySchema), createUnit);
router.put('/:id', authMiddleware, requireRole('admin'), validateBody(unitBodySchema), updateUnit);
router.delete('/:id', authMiddleware, requireRole('admin'), deleteUnit);

export default router;
