import {Request, Response, Router} from 'express';

import adminController from '../controllers/admin.controller';

const router = Router();

router.get('/:model/get', adminController.getByModel);
router.get('/:model/create', async (_req: Request, _res: Response) => {});
router.get('/role/create', adminController.createRole);
router.post('/reaction/create', adminController.createReaction);

export default router;
