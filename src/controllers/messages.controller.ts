import e, {Request, Response} from 'express';
import messagesService from '../services/messages.service';
import {Emoji, Message, Section} from '@prisma/client';

class MessagesController {
    async createMessage(req: Request<{}, {}, Message>, res: Response) {
        try {
            const message = await messagesService.createMessage(
                req.body,
                req.headers.authorization,
            );
            res.json(message);
        } catch (error) {
            res.status(500).json({error: `Failed to create message: ${(error as Error).message}`});
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
        req: Request<{messageId: Message['id']}, {}, {sectionId: Section['id']}>,
        res: Response,
    ) {
        try {
            const {messageId} = req.params;
            const {sectionId} = req.body;
            const message = await messagesService.updateMessage(messageId, sectionId);
            res.json(message);
        } catch (error) {
            res.status(500).json({error: `Failed to update message: ${(error as Error).message}`});
        }
    }

    async deleteMessage(req: Request<{messageId: Message['id']}>, res: Response) {
        try {
            const {messageId} = req.params;
            const message = await messagesService.deleteMessage(messageId);
            res.json(message);
        } catch (error) {
            res.status(500).json({error: `Failed to delete message: ${(error as Error).message}`});
        }
    }

    async addEmoji(req: Request<{messageId: Message['id']}, {}, {emoji: Emoji}>, res: Response) {
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
