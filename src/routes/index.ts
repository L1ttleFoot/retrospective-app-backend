import {Router} from 'express';

import {authMiddleware} from '../middleware/authMiddleware';
import {roleGuardMiddleware} from '../middleware/roleGuardMiddleware';
import adminRouter from './admin';
import authRouter from './auth';
import authSessionsRouter from './auth-sessions';
import boardsRouter from './boards';
import messagesRouter from './messages';
import SSERouter from './SSE';
import sectionsRouter from './sections';
import templatesRouter from './templates';
import testRouter from './test';

const router = Router();

router.use('/auth', authRouter);
router.use('/boards', authMiddleware, boardsRouter);
router.use('/sections', sectionsRouter);
router.use('/messages', messagesRouter);
router.use('/templates', authMiddleware, templatesRouter);

router.use('/test', testRouter);
router.use('/admin', authMiddleware, roleGuardMiddleware(['ADMIN']), adminRouter);
router.use('/auth-sessions', authSessionsRouter);

router.use('/event', SSERouter);

export default router;
