import {Router} from 'express';

import messagesContoller from '../controllers/messages.controller';
import {authMiddleware} from '../middleware/authMiddleware';
import {guestMiddleware} from '../middleware/guestMiddleware';
import {roleGuardMiddleware} from '../middleware/roleGuardMiddleware';

const router = Router();

router.post('/', guestMiddleware(), messagesContoller.createMessage);
router.get('/:sectionId', guestMiddleware(false), messagesContoller.getMessagesBySectionId);
router.post('/:messageId/update', messagesContoller.updateMessage);
router.delete('/:messageId', messagesContoller.deleteMessage);
router.delete(
	'/test/cleanup',
	authMiddleware,
	roleGuardMiddleware(['TEST_USER']),
	messagesContoller.deleteAllMessage,
);

router.post('/:messageId/reaction', guestMiddleware(), messagesContoller.setReaction);
router.delete('/reaction/:reactionId', messagesContoller.removeReaction);

export default router;
