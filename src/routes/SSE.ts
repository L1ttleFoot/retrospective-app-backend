import {error} from 'console';
import {Request, Response, Router} from 'express';

import {EVENTS, appEvents} from '../utils/events';

const router = Router();

const activeClients = new Set<Response>();

router.use('/', (req: Request, res: Response) => {
	console.log('client conntected');

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cache-Control', 'no-cache');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders();

	res.write(':ok\n\n');
	/* setInterval(() => {
		res.write(`data: ${JSON.stringify(new Date().toLocaleDateString())}\n\n`);
	}, 2000); */

	/* const broadcast = (data: Record<string, unknown>) => {
		res.write(`data: ${JSON.stringify(data)}\n\n`);
	};

	appEvents.on(EVENTS.MESSAGE, broadcast);

	activeClients.add(res);

	req.on('close', () => {
		appEvents.off(EVENTS.MESSAGE, broadcast);
		activeClients.delete(res);
	}); */

	activeClients.add(res);

	req.on('close', () => {
		console.log('client disconntected');
		activeClients.delete(res);
	});
});

export const notifyAllClients = (data: Record<string, unknown>) => {
	const payload = `data: ${JSON.stringify(data)}\n\n`;
	activeClients.forEach((client) => {
		try {
			client.write(payload);
		} catch (error) {
			console.log(error);
			activeClients.delete(client);
		}
	});
};

export default router;
