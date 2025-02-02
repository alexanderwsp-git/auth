import { Router } from 'express';

import health from './health';
import auth from './auth';
import setting from './setting';

const router = Router();

router.use('/health', health);
router.use('/auth', auth);
router.use('/setting', setting);

export default router;
