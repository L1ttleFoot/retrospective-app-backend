import {Discussion} from '@prisma/types';
import {Request, Response} from 'express';

import discussionsService from '../services/discussions.service';
import {handleError} from '../utils/errorsHandler';

//import sectcionsService from '../services/sections.service';

class DiscussionsController {
	async createDiscussion(req: Request<unknown, unknown, Discussion>, res: Response) {
		try {
			const discussions = await discussionsService.createDiscussion(req.body);
			res.json(discussions);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: `Failed to create discussion: ${message}`});
		}
	}

	async getDiscussions(req: Request, res: Response) {
		try {
			const discussions = await discussionsService.getDiscussions(req.user.id);
			res.json(discussions);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: `Failed to get discussions: ${message}`});
		}
	}

	async deleteDiscussion(req: Request<{discussionId: Discussion['id']}>, res: Response) {
		try {
			const {discussionId} = req.params;
			//await sectionsService.deleteSectionsWithDiscussion(id)
			const discussion = await discussionsService.deleteDiscussion(discussionId);
			res.json(discussion);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: `Failed to delete discussion: ${message}`});
		}
	}
}

export default new DiscussionsController();
