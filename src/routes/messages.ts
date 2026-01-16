import {Router} from 'express';

import messagesContoller from '../controllers/messages.controller';

const router = Router();

router.post('/', messagesContoller.createMessage);
router.get('/:sectionId', messagesContoller.getMessagesBySectionId);
router.post('/:messageId/update', messagesContoller.updateMessage);
router.delete('/:messageId', messagesContoller.deleteMessage);

router.post('/:messageId/emojies', messagesContoller.addEmoji);

export default router;
