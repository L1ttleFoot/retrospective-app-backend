import {Router} from 'express';

import authSessionsController from '../controllers/auth-sessions.controller';

const router = Router();

router.post('/register-session', authSessionsController.register);
router.post('/login-session', authSessionsController.login);
router.get('/logout-session', authSessionsController.logout);

export default router;
