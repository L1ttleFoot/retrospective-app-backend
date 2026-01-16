import {User} from '@prisma/client';
import {Request, Response} from 'express';

import authSessionsService from '../services/auth-sessions.service';

class AuthSessionsController {
	async register(req: Request<unknown, unknown, User>, res: Response) {
		try {
			const user = await authSessionsService.register(req.body);
			res.json(user);
		} catch (error) {
			res.status(500).json({error: `Failed to create user: ${(error as Error).message}`});
		}
	}

	async login(req: Request<unknown, unknown, User>, res: Response) {
		try {
			const {accessToken, refreshToken, roles, id} = await authSessionsService.login(req.body);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: process.env.NODE_ENV === 'production',
				secure: process.env.NODE_ENV === 'production',
				sameSite: 'none',
			});

			res.json({id, username: req.body.username, token: accessToken, roles});
		} catch (error) {
			res.status(500).json({error: `Failed to login: ${(error as Error).message}`});
		}
	}

	logout(_: Request, res: Response) {
		res.clearCookie('refreshToken');
		res.sendStatus(200);
	}
}

export default new AuthSessionsController();
