import {Request, Response, Router} from 'express';

import adminController from '../controllers/admin.controller';

const router = Router();

router.get('/:model/get', adminController.getByModel);
router.get('/:model/create', async (_req: Request, _res: Response) => {});

export default router;
