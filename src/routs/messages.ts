import {Router} from 'express';
import messagesContoller from '../controllers/messages.controller';

const router = Router();

router.post('/', messagesContoller.createMessage);
router.get('/:sectionId', messagesContoller.getMessagesBySectionId);
router.delete('/:messageId', messagesContoller.deleteMessage);

export default router;
