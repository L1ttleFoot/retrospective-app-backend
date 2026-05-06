import {Request, Response} from 'express';

import {Reaction, Role, User} from '@/generated/prisma/client';

import {prisma} from '../prisma';

class AdminController {
	async getByModel(req: Request<{model: 'user' | 'role' | 'reaction'}>, res: Response) {
		const {model} = req.params;

		try {
			let result:
				| Role[]
				| (Pick<User, 'id' | 'username'> & {roles: Role[]})[]
				| Reaction[]
				| undefined;
			switch (model) {
				case 'user':
					result = await prisma.user.findMany({select: {id: true, username: true, roles: true}});
					break;
				case 'role':
					result = await prisma.role.findMany();
					break;
				case 'reaction':
					result = await prisma.reaction.findMany();
					break;
				default:
					res.status(400).json({error: 'Invalid model'});
			}
			res.json(result);
		} catch (error) {
			res.status(500).json({error: (error as Error).message});
		}
	}

	async createRole(req: Request<unknown, unknown, {value: Role['value']}>, res: Response) {
		const {value} = req.body;

		await prisma.role.create({data: {value}});

		res.status(200).send();
	}

	async createReaction(req: Request<unknown, unknown, Reaction>, res: Response) {
		const {id, value} = req.body;

		await prisma.reaction.create({data: {id, value}});

		res.status(200).send();
	}
}

export default new AdminController();
