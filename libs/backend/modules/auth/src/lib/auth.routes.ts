import { Router } from 'express';

import { AuthController } from './auth.controller';
import { authLimiter, registerLimiter } from './middleware/auth.limiters';
import {
  validateLoginPayload,
  validateRegisterPayload,
} from './middleware/auth.validator';

const router = Router();
const controller = new AuthController();

router.post(
  '/register',
  registerLimiter,
  validateRegisterPayload,
  controller.register.bind(controller),
);
router.post(
  '/login',
  authLimiter,
  validateLoginPayload,
  controller.login.bind(controller),
);
router.post('/refresh', controller.refresh.bind(controller));

export const authRouter = router;
