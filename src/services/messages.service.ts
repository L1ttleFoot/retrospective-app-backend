import {prisma} from '..';
import {Message, Section} from '@prisma/client';

class MessagesService {
    async createMessage(message: Message) {
        return prisma.message.create({data: message});
    }

    async getMessages(sectionId: Section['id']) {
        return prisma.message.findMany({where: {sectionId}});
    }

    async deleteMessage(messageId: Message['id']) {
        return prisma.message.delete({where: {id: messageId}});
    }
}

export default new MessagesService();
