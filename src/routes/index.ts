import {Router} from 'express';

import {authMiddleware} from '../middleware/authMiddleware';
import adminRouter from './admin';
import authRouter from './auth';
import authSessionsRouter from './auth-sessions';
import discussionsRouter from './discussions';
import messagesRouter from './messages';
import SSERouter from './SSE';
import sectionsRouter from './sections';
import templatesRouter from './templates';
import testRouter from './test';

const router = Router();

router.use('/auth', authRouter);
router.use('/discussions', authMiddleware, discussionsRouter);
router.use('/sections', sectionsRouter);
router.use('/messages', messagesRouter);
router.use('/templates', authMiddleware, templatesRouter);

router.use('/test', testRouter);
router.use('/admin', adminRouter);
router.use('/auth-sessions', authSessionsRouter);

router.use('/event', SSERouter);

export default router;
