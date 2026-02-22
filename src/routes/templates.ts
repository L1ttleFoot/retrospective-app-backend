import {Router} from 'express';

import templatesController from '../controllers/templates.controller';

const router = Router();

router.post('/', templatesController.createTemplate);
router.get('/', templatesController.getTemplates);
router.delete('/:templateId', templatesController.deleteTemplate);

export default router;
