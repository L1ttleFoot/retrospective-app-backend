import {NextFunction, Request, Response} from 'express';

export const roleGuardMiddleware = (allowedRoles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const userRoles = req.user?.roles;

		if (!userRoles || !userRoles.some((role) => allowedRoles.includes(role))) {
			res.sendStatus(403);
			return;
		}

		next();
	};
};
