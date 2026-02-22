import {Router} from 'express';

import discusstionsController from '../controllers/discussions.controller';

const router = Router();

router.post('/', discusstionsController.createDiscussion);
router.get('/',  discusstionsController.getDiscussions);
router.delete('/:discussionId', discusstionsController.deleteDiscussion);

export default router;
