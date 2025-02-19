import {prisma} from '..';
import {Discussion} from '@prisma/client';

class DiscussionsService {
    async createDiscussion(discussion: Discussion) {
        return prisma.discussion.create({data: discussion});
    }

    async getDiscussions() {
        return prisma.discussion.findMany();
    }

    async deleteDiscussion(discussionId: Discussion['id']) {
        return prisma.discussion.delete({where: {id: discussionId}});
    }
}

export default new DiscussionsService();
