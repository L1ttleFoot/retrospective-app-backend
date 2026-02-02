import {Discussion} from '@prisma/types';
import {Request, Response} from 'express';

import discussionsService from '../services/discussions.service';

//import sectcionsService from '../services/sections.service';

class DiscussionsController {
	async createDiscussion(req: Request<unknown, unknown, Discussion>, res: Response) {
		try {
			const discussions = await discussionsService.createDiscussion(req.body);
			res.json(discussions);
		} catch (error) {
			res.status(500).json({error: `Failed to create discussion: ${(error as Error).message}`});
		}
	}

	async getDiscussions(_req: Request, res: Response) {
		try {
			const discussions = await discussionsService.getDiscussions();
			res.json(discussions);
		} catch (error) {
			res.status(500).json({error: `Failed to get discussions: ${(error as Error).message}`});
		}
	}

	async deleteDiscussion(req: Request<{discussionId: Discussion['id']}>, res: Response) {
		try {
			const {discussionId} = req.params;
			//await sectionsService.deleteSectionsWithDiscussion(id)
			const discussion = await discussionsService.deleteDiscussion(discussionId);
			res.json(discussion);
		} catch (error) {
			res.status(500).json({error: `Failed to delete discussion: ${(error as Error).message}`});
		}
	}
}

export default new DiscussionsController();
