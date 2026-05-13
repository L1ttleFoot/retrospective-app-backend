import {Message, MessageReaction, Reaction, Section, User} from '@/generated/prisma/client';

import {prisma} from '../prisma';
import {ApiError} from '../utils/errorsHandler';

class MessagesService {
	async createMessage(message: Message, authorId: string) {
		return prisma.message.create({data: {...message, authorId}});
	}

	async getMessages(sectionId: Section['id'], userId?: string) {
		const messages = await prisma.message.findMany({
			where: {sectionId},
			include: {
				reactions: {include: {reaction: true}},
				section: {include: {board: {select: {ownerId: true}}}},
			},
			orderBy: {createdAt: 'asc'},
		});

		return messages.map((message) => {
			const {section, reactions, ...rest} = message;

			const reactionsMap = reactions.reduce((acc, curr) => {
				const reactionValue = curr.reaction.value;
				const existingValue = acc.get(reactionValue);
				const isSelected = curr.authorId === userId;
				const id = curr.reactionId;

				if (existingValue) {
					existingValue.count++;
					if (isSelected) {
						existingValue.isSelected = true;
					}
				} else {
					acc.set(reactionValue, {value: reactionValue, isSelected, count: 1, id});
				}

				return acc;
			}, new Map<
				string,
				{id: string; value: string; count: number; isSelected: boolean; userReactionId?: string}
			>());

			const formatedReactions = Array.from(reactionsMap.values());

			return {...rest, reactions: formatedReactions, ownerId: section.board.ownerId};
		});
	}

	async updateMessage(messageId: Message['id'], payload: Partial<Message>) {
		return prisma.message.update({where: {id: messageId}, data: payload});
	}

	async deleteMessage(messageId: Message['id']) {
		return prisma.message.delete({where: {id: messageId}});
	}

	async deleteAllMessages(id: User['id']) {
		const user = await prisma.user.findUnique({where: {id}, include: {roles: true}});

		if (!user) {
			throw new ApiError(401, 'Unauthorized');
		}

		const isTestUser = user.roles.some((role) => role.value === 'TEST_USER');

		if (!isTestUser) {
			throw new ApiError(403, 'Forbidden');
		}

		await prisma.message.deleteMany({where: {section: {board: {ownerId: id}}}});
	}

	async setReaction(
		messageId: Message['id'],
		userId: MessageReaction['authorId'],
		reactionId: Reaction['id'],
	) {
		return prisma.messageReaction.create({data: {messageId, reactionId, authorId: userId}});
	}

	async remodeReaction(reactionId: MessageReaction['id']) {
		return prisma.messageReaction.delete({where: {id: reactionId}});
	}

	async handleReaction(
		messageId: Message['id'],
		userId: MessageReaction['authorId'],
		reactionId: Reaction['id'],
	) {
		const existingReaction = await prisma.messageReaction.findUnique({
			where: {reactionId_messageId_authorId: {reactionId, messageId, authorId: userId}},
		});

		if (existingReaction) {
			return await prisma.messageReaction.delete({where: {id: existingReaction.id}});
		}

		return await prisma.messageReaction.create({data: {messageId, reactionId, authorId: userId}});
	}
}

export default new MessagesService();
