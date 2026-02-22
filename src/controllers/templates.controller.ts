import {Request, Response} from 'express';

import {Template, TemplateSection} from '@/generated/prisma/client';

import templateService from '../services/template.service';

class TemplatesController {
	async createTemplate(
		req: Request<unknown, unknown, {title: Template['title']; sections: TemplateSection[]}>,
		res: Response,
	) {
		try {
			const templates = await templateService.createTemplates({
				id: req.user?.id || '',
				title: req.body.title,
				sections: req.body.sections,
			});
			res.json(templates);
		} catch (error) {
			res.status(500).json({error: `Failed to get templates: ${(error as Error).message}`});
		}
	}

	async getTemplates(req: Request, res: Response) {
		try {
			const templates = await templateService.getTemplates(req.user?.id || '');
			res.json(templates);
		} catch (error) {
			res.status(500).json({error: `Failed to get templates: ${(error as Error).message}`});
		}
	}

	async deleteTemplate(req: Request<{templateId: Template['id']}>, res: Response) {
		try {
			const {templateId} = req.params;
			const templates = await templateService.deleteTemplates(templateId);
			res.json(templates);
		} catch (error) {
			res.status(500).json({error: `Failed to get templates: ${(error as Error).message}`});
		}
	}
}

export default new TemplatesController();
