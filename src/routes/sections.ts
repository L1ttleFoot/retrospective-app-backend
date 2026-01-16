import {Router} from 'express';

import sectionsController from '../controllers/sections.controller';
import {authMiddleware} from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, sectionsController.createSections);
router.get('/:discussionId', sectionsController.getSectionsByDiscussionId);
router.delete('/:sectionId', authMiddleware, sectionsController.deleteSection);

export default router;
