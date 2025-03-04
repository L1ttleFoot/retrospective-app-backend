import {Router} from 'express';
import discussionsRouter from './discussions';
import sectionsRouter from './sections';
import messagesRouter from './messages';
import authRouter from './auth';
import testRouter from './test';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();

router.use('/', authRouter);
router.use('/discussions', discussionsRouter);
router.use('/sections', sectionsRouter);
router.use('/messages', messagesRouter);
router.use('/test', testRouter);
router.use('/create', async(req, res) => {

    await prisma.role.create({data: {value: 'ADMIN'}});

    res.json({message: 'Created'});
});

export default router;
