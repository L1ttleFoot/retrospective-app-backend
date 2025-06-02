import {prisma} from '..';
import {Emoji, Message, Section} from '@prisma/client';
import jwt, {JwtPayload} from 'jsonwebtoken';

class MessagesService {
    async createMessage(message: Message, auth: string | undefined) {
        let resultAuthorId = null;

        if (!auth) {
            resultAuthorId = message.authorId || crypto.randomUUID();
        } else {
            const decodedToken = jwt.decode(auth.split(' ')[1]);
            if (decodedToken && typeof decodedToken === 'object' && 'id' in decodedToken) {
                resultAuthorId = (decodedToken as JwtPayload).id;
            }
        }

        return prisma.message.create({data: {...message, authorId: resultAuthorId}});
    }

    async getMessages(sectionId: Section['id']) {
        const messages = await prisma.message.findMany({
            where: {sectionId},
            include: {
                emojies: {include: {emoji: true}},
                section: {include: {discussion: {select: {ownerId: true}}}},
            },
            orderBy: {updatedAt: 'asc'},
        });

        return messages.map((message) => {
            const {section, ...messageWithoutSection} = message;
            return {
                ...messageWithoutSection,
                ownerId: message.section.discussion.ownerId,
            };
        });
    }

    async updateMessage(messageId: Message['id'], sectionId: Section['id']) {
        return prisma.message.update({where: {id: messageId}, data: {sectionId}});
    }

    async deleteMessage(messageId: Message['id']) {
        return prisma.message.delete({where: {id: messageId}});
    }

    async addEmoji(messageId: Message['id'], emoji: Emoji) {
        return prisma.messageEmoji.create({
            data: {
                messageId,
                emojiId: emoji.id,
                count: 1,
            },
        });
    }
}

export default new MessagesService();
