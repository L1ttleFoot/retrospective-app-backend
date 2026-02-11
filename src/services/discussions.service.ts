import {Discussion} from '@prisma/types';

import {prisma} from '../app';

class DiscussionsService {
	async createDiscussion(discussion: Discussion) {
		return prisma.discussion.create({data: discussion});
	}

	async getDiscussions(id: string) {
		return prisma.discussion.findMany({where: {ownerId: id}, orderBy: {createdAt: 'desc'}});
	}

	async deleteDiscussion(discussionId: Discussion['id']) {
		return prisma.discussion.delete({where: {id: discussionId}});
	}
}

export default new DiscussionsService();
