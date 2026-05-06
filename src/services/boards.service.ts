import {Board} from '@/generated/prisma/client';

import {prisma} from '../prisma';
import {ApiError} from '../utils/errorsHandler';

class BoardsService {
	async createBoard(board: Board) {
		return prisma.board.create({data: board});
	}

	async getBoards(id: string) {
		const user = await prisma.user.findUnique({where: {id}, include: {roles: true}});

		if (!user) {
			throw new ApiError(404, 'User not found');
		}

		return prisma.board.findMany({where: {ownerId: id}, orderBy: {createdAt: 'desc'}});
	}

	async deleteBoard(boardId: Board['id']) {
		return prisma.board.delete({where: {id: boardId}});
	}
}

export default new BoardsService();
