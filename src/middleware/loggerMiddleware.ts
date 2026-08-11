import {Request, Response} from 'express';
import pinoHttp from 'pino-http';

export const loggerMiddleware = pinoHttp({
	transport:
		process.env.NODE_ENV !== 'production'
			? {target: 'pino-pretty', options: {colorize: true}}
			: undefined,

	serializers: {req: () => undefined, res: () => undefined},

	customSuccessMessage: (req: Request, res: Response, responseTime) => {
		const userId = req.user ? req.user.id : 'anonymous';
		return `${req.method} ${req.url} - ${res.statusCode} (${responseTime}ms) - User: ${userId}`;
	},

	customErrorMessage: (req: Request, res: Response, err) => {
		const userId = req.user ? req.user.id : 'anonymous';
		return `FAIL ${req.method} ${req.url} - ${res.statusCode} - Error: ${err.message} - User: ${userId}`;
	},
});
