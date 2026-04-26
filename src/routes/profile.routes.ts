import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/profiles/:username', optionalAuth, userController.getProfile);
router.post('/profiles/:username/follow', authenticate, userController.followUser);
router.delete('/profiles/:username/follow', authenticate, userController.unfollowUser);

export default router;
