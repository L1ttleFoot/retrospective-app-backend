import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
	const accessToken = req.headers.authorization?.split(' ')[1];

	if (!accessToken) {
		res.sendStatus(401);
		return;
	}

	const secret = process.env.ACCESS_TOKEN_SECRET;

	if (!secret) {
		res.sendStatus(500);
		return;
	}

	jwt.verify(accessToken, secret, (err: jwt.VerifyErrors | null, decoded) => {
		if (err) {
			res.sendStatus(401);
			return;
		}

		req.user = decoded;

		next();
	});
};
