import {Router} from 'express';

import discusstionsController from '../controllers/discussions.controller';
import {authMiddleware} from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, discusstionsController.createDiscussion);
router.get('/', authMiddleware, discusstionsController.getDiscussions);
router.delete('/:discussionId', authMiddleware, discusstionsController.deleteDiscussion);

export default router;
