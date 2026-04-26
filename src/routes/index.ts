import { Router } from 'express';
import userRoutes from './user.routes';
import profileRoutes from './profile.routes';
import articleRoutes from './article.routes';

const router = Router();

router.use(userRoutes);
router.use(profileRoutes);
router.use(articleRoutes);

export default router;
