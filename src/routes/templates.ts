import {Router} from 'express';

import templatesController from '../controllers/templates.controller';
import {authMiddleware} from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, templatesController.createTemplate);
router.get('/', authMiddleware, templatesController.getTemplates);
router.delete('/:templateId', authMiddleware, templatesController.deleteTemplate);

export default router;
