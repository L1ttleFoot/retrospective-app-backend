import {Request, Response} from 'express';

import {Board} from '@/generated/prisma/client';

import boardsService from '../services/boards.service';
import {handleError} from '../utils/errorsHandler';

//import sectcionsService from '../services/sections.service';

class BoardsController {
	async createBoard(req: Request<unknown, unknown, Board>, res: Response) {
		try {
			const boards = await boardsService.createBoard(req.body);
			res.json(boards);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: `Failed to create board: ${message}`});
		}
	}

	async getBoards(req: Request, res: Response) {
		try {
			const boards = await boardsService.getBoards(req.user?.id ?? '');
			res.json(boards);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: `Failed to get boards: ${message}`});
		}
	}

	async deleteBoard(req: Request<{boardId: Board['id']}>, res: Response) {
		try {
			const {boardId} = req.params;
			//await sectionsService.deleteSectionsWithBoard(id)
			const board = await boardsService.deleteBoard(boardId);
			res.json(board);
		} catch (error) {
			const {statusCode, message} = handleError(error);
			res.status(statusCode).json({error: `Failed to delete board: ${message}`});
		}
	}
}

export default new BoardsController();
