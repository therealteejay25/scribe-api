import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { registerSchema, loginSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

router.post('/users', validate(registerSchema), userController.register);
router.post('/users/login', validate(loginSchema), userController.login);
router.get('/user', authenticate, userController.getCurrentUser);
router.put('/user', authenticate, validate(updateUserSchema), userController.updateUser);

export default router;
