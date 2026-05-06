import {Board, Section} from '@/generated/prisma/client';

import {prisma} from '../prisma';

class SectionsService {
	async createSection({sections}: {sections: Section[]}) {
		return prisma.section.createManyAndReturn({data: sections});
	}

	async getSections({boardId}: {boardId: Section['boardId']}) {
		return prisma.section.findMany({where: {boardId}});
	}

	async deleteSection({sectionId}: {sectionId: Section['id']}) {
		return prisma.section.delete({where: {id: sectionId}});
	}

	async deleteSectionsWithBoard(id: Board['id']) {
		return prisma.section.deleteMany({where: {boardId: id}});
	}
}

export default new SectionsService();
