import {Router} from 'express';

import discusstionsController from '../controllers/boards.controller';

const router = Router();

router.post('/', discusstionsController.createBoard);
router.get('/', discusstionsController.getBoards);
router.delete('/:boardId', discusstionsController.deleteBoard);

export default router;
