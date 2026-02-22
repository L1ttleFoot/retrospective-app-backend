import {Discussion} from '@prisma/types';

import {prisma} from '../app';
import {ApiError} from '../utils/errorsHandler';

class DiscussionsService {
	async createDiscussion(discussion: Discussion) {
		return prisma.discussion.create({data: discussion});
	}

	async getDiscussions(id: string) {
		const user = await prisma.user.findUnique({where: {id}, include: {roles: true}});

		if (!user) {
			throw new ApiError(404, 'User not found');
		}

		return prisma.discussion.findMany({where: {ownerId: id}, orderBy: {createdAt: 'desc'}});
	}

	async deleteDiscussion(discussionId: Discussion['id']) {
		return prisma.discussion.delete({where: {id: discussionId}});
	}
}

export default new DiscussionsService();
