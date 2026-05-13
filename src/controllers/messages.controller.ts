import {Request, Response} from 'express';

import {Message, MessageReaction, Reaction, Section} from '@/generated/prisma/client';

import {notifyAllClients} from '../routes/SSE';
import messagesService from '../services/messages.service';
import {handleError} from '../utils/errorsHandler';

class MessagesController {
	async createMessage(req: Request<unknown, unknown, Message>, res: Response) {
		try {
			const authorId = (req.user?.id ?? req.guestId)!;

			const message = await messagesService.createMessage(req.body, authorId);
			notifyAllClients({main: 'messages', id: req.body.sectionId});
			//appEvents.emit(EVENTS.MESSAGE, message);
			res.json(message);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: `Failed to create message: ${message}`});
		}
	}

	async getMessagesBySectionId(req: Request<{sectionId: Section['id']}>, res: Response) {
		try {
			const {sectionId} = req.params;

			const userId = req.user?.id || req.guestId;
			const messages = await messagesService.getMessages(sectionId, userId);
			res.json({messages});
		} catch (error) {
			res.status(500).json({error: `Failed to get messages: ${(error as Error).message}`});
		}
	}

	async updateMessage(
		req: Request<{messageId: Message['id']}, unknown, Partial<Message>>,
		res: Response,
	) {
		try {
			const {messageId} = req.params;
			const dto = req.body;
			const message = await messagesService.updateMessage(messageId, dto);
			res.json(message);
		} catch (error) {
			res.status(500).json({error: `Failed to update message: ${(error as Error).message}`});
		}
	}

	async deleteMessage(req: Request<{messageId: Message['id']}>, res: Response) {
		try {
			const {messageId} = req.params;
			const message = await messagesService.deleteMessage(messageId);
			notifyAllClients({main: 'messages', id: message.sectionId});
			//appEvents.emit(EVENTS.MESSAGE, message);
			res.json(message);
		} catch (error) {
			res.status(500).json({error: `Failed to delete message: ${(error as Error).message}`});
		}
	}

	async deleteAllMessage(req: Request, res: Response) {
		try {
			await messagesService.deleteAllMessages(req.user?.id || '');
			res.status(200).send();
		} catch (error) {
			res.status(500).json({error: `Failed to delete messages: ${(error as Error).message}`});
		}
	}

	async setReaction(
		req: Request<{messageId: Message['id']}, unknown, {reactionId: Reaction['id']}>,
		res: Response,
	) {
		try {
			const {messageId} = req.params;
			const {reactionId} = req.body;
			const userId = req.user?.id || req.guestId || '';
			const message = await messagesService.handleReaction(messageId, userId, reactionId);

			//notifyAllClients({main: 'messages'});

			res.json(message);
		} catch (error) {
			res.status(500).json({error: `Failed to add reaction: ${(error as Error).message}`});
		}
	}

	async removeReaction(req: Request<{reactionId: MessageReaction['id']}>, res: Response) {
		const {reactionId} = req.params;

		await messagesService.remodeReaction(reactionId);
		res.sendStatus(200);
	}
}

export default new MessagesController();
