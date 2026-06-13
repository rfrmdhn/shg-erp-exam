import { Router } from 'express';
import { login, logout } from '../controllers/auth.controller';
import { validateBody } from '../middleware/validate.middleware';
import { loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validateBody(loginSchema), login);
router.post('/logout', logout);

export default router;
