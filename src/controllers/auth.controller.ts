import {User} from '@prisma/types';
import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import {prisma} from '../app';
import authService from '../services/auth.service';
import {generateAccessToken, generateRefreshToken} from '../utils/jwtTokens';

class AuthController {
	async register(req: Request<unknown, unknown, User>, res: Response) {
		try {
			const user = await authService.register(req.body);
			res.json(user);
		} catch (error) {
			res.status(500).json({error: `Failed to create user: ${(error as Error).message}`});
		}
	}

	async login(req: Request<unknown, unknown, User>, res: Response) {
		try {
			const {accessToken, refreshToken, roles, id} = await authService.login(req.body);

			res.cookie('refreshToken', refreshToken, {
				httpOnly: process.env.NODE_ENV === 'production',
				secure: process.env.NODE_ENV === 'production',
				sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
			});

			res.json({id, username: req.body.username, token: accessToken, roles});
		} catch (error) {
			res.status(500).json({error: `Failed to login: ${(error as Error).message}`});
		}
	}

	refreshAccessToken(req: Request, res: Response) {
		const accessToken = req.headers.authorization?.split(' ')[1];
		const refreshToken = req.cookies.refreshToken;

		if (!accessToken || !refreshToken) {
			console.log(req.cookies);
			console.log(
				'No access token or refresh token provided',
				`accessToken:${accessToken}`,
				`refreshToken:${refreshToken}`,
			);
			res.sendStatus(403);
			return;
		}

		jwt.verify(
			refreshToken,
			process.env.REFRESH_TOKEN_SECRET || '',
			async (err: jwt.VerifyErrors | null, payload: jwt.JwtPayload | string | undefined) => {
				if (err || !payload) {
					console.log('Invalid refresh token');
					res.sendStatus(403);
					return;
				}

				const userId = (payload as jwt.JwtPayload & {id: string}).id;

				const accessToken = generateAccessToken(userId);
				const refreshToken = generateRefreshToken(userId);

				const user = await prisma.user.findUnique({where: {id: userId}, include: {roles: true}});
				if (!user) {
					res.sendStatus(404);
					return;
				}

				res.cookie('refreshToken', refreshToken, {
					httpOnly: process.env.NODE_ENV === 'production',
					secure: process.env.NODE_ENV === 'production',
					sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
				});
				res.json({id: user.id, username: user?.username, token: accessToken, roles: user.roles});
			},
		);
	}

	logout(_: Request, res: Response) {
		res.clearCookie('refreshToken');
		res.sendStatus(200);
	}
}

export default new AuthController();
