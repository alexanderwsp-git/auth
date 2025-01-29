import { Router } from 'express';

import health from './health';
import auth from './auth';
import param from './param';

const router = Router();

router.use('/health', health);
router.use('/auth', auth);
router.use('/param', param);

export default router;
