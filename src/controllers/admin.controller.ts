import {Emoji, Role, User} from '@prisma/types';
import {Request, Response} from 'express';

import {prisma} from '../app';

class AdminController {
	async getByModel(req: Request<{model: 'user' | 'role' | 'emoji'}>, res: Response) {
		const {model} = req.params;

		try {
			let result:
				| Role[]
				| (Pick<User, 'id' | 'username'> & {roles: Role[]})[]
				| Emoji[]
				| undefined;
			switch (model) {
				case 'user':
					result = await prisma.user.findMany({select: {id: true, username: true, roles: true}});
					break;
				case 'role':
					result = await prisma.role.findMany();
					break;
				case 'emoji':
					result = await prisma.emoji.findMany();
					break;
				default:
					res.status(400).json({error: 'Invalid model'});
			}
			res.json(result);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	}
}

export default new AdminController();
