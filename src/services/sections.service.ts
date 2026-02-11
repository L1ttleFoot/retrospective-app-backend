import {Discussion, Section} from '@prisma/types';

import {prisma} from '../app';

class SectionsService {
	async createSection({sections}: {sections: Section[]}) {
		return prisma.section.createManyAndReturn({data: sections});
	}

	async getSections({discussionId}: {discussionId: Section['discussionId']}) {
		return prisma.section.findMany({where: {discussionId}});
	}

	async deleteSection({sectionId}: {sectionId: Section['id']}) {
		return prisma.section.delete({where: {id: sectionId}});
	}

	async deleteSectionsWithDiscussion(id: Discussion['id']) {
		return prisma.section.deleteMany({where: {discussionId: id}});
	}
}

export default new SectionsService();
