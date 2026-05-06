import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

import {Role, User} from '../generated/prisma';

export const guestMiddleware = (wtihGenerate = true) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const accessToken = req.headers.authorization?.split(' ')[1];
		const secret = process.env.ACCESS_TOKEN_SECRET;

		if (accessToken && secret) {
			try {
				const decoded = jwt.decode(accessToken);
				req.user = decoded as {id: User['id']; roles: Role['value'][]};
				return next();
			} catch (err) {
				console.log(err);
			}
		}

		const guestId = req.headers['x-guest-id'] as string;

		if (guestId) {
			res.setHeader('x-guest-id', guestId);
			req.guestId = guestId;

			return next();
		}

		if (wtihGenerate) {
			const generatedGuestId = crypto.randomUUID();

			res.setHeader('x-guest-id', generatedGuestId);
			req.guestId = generatedGuestId;
		}

		next();
	};
};
