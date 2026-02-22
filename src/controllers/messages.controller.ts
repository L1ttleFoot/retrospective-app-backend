import {Request, Response} from 'express';

import {Emoji, Message, Section} from '@/generated/prisma/client';

import {notifyAllClients} from '../routes/SSE';
import messagesService from '../services/messages.service';
import {handleError} from '../utils/errorsHandler';
import {EVENTS, appEvents} from '../utils/events';

class MessagesController {
	async createMessage(req: Request<unknown, unknown, Message>, res: Response) {
		try {
			const message = await messagesService.createMessage(req.body, req.headers.authorization);
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
			const messages = await messagesService.getMessages(sectionId);
			res.json(messages);
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

	async addEmoji(req: Request<{messageId: Message['id']}, unknown, {emoji: Emoji}>, res: Response) {
		try {
			const {messageId} = req.params;
			const {emoji} = req.body;
			const message = await messagesService.addEmoji(messageId, emoji);
			res.json(message);
		} catch (error) {
			res.status(500).json({error: `Failed to add emoji: ${(error as Error).message}`});
		}
	}
}

export default new MessagesController();
