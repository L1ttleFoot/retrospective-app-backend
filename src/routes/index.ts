import {Router} from 'express';
import discussionsRouter from './discussions';
import sectionsRouter from './sections';
import messagesRouter from './messages';
import authRouter from './auth';
import testRouter from './test';
import adminRouter from './admin';

const router = Router();

router.use('/', authRouter);
router.use('/discussions', discussionsRouter);
router.use('/sections', sectionsRouter);
router.use('/messages', messagesRouter);
router.use('/test', testRouter);
router.use('/admin', adminRouter);

export default router;
