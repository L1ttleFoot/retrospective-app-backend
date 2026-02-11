import {Template, TemplateSection} from '@prisma/types';

import {prisma} from '../app';

class TemplateService {
	async createTemplates({
		id,
		title,
		sections,
	}: {
		id: string;
		title: string;
		sections: TemplateSection[];
	}) {
		return prisma.template.create({
			data: {title, user: {connect: {id}}, sections: {create: sections}},
		});
	}

	async getTemplates({id}: {id: Template['id']}) {
		return prisma.template.findMany({where: {userId: id}, include: {sections: true}});
	}

	async deleteTemplates(id: Template['userId']) {
		return prisma.template.delete({where: {id}});
	}
}

export default new TemplateService();
