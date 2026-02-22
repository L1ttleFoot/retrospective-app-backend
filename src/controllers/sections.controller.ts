import {Request, Response} from 'express';

import {Section} from '@/generated/prisma/client';

import sectionsService from '../services/sections.service';
import {handleError} from '../utils/errorsHandler';

class SectionsController {
	async createSections(req: Request<unknown, unknown, {sections: Section[]}>, res: Response) {
		try {
			const sections = await sectionsService.createSection(req.body);
			res.json(sections);
		} catch (error) {
			res.status(500).json({error: `Failed to create sections: ${(error as Error).message}`});
		}
	}

	async getSectionsByDiscussionId(
		req: Request<{discussionId: Section['discussionId']}>,
		res: Response,
	) {
		try {
			const sections = await sectionsService.getSections(req.params);
			res.json(sections);
		} catch (error) {
			res.status(500).json({error: `Failed to get sections: ${(error as Error).message}`});
		}
	}

	async deleteSection(req: Request<{sectionId: Section['id']}>, res: Response) {
		try {
			const section = await sectionsService.deleteSection(req.params);
			res.json(section);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: message});
		}
	}
}

export default new SectionsController();
