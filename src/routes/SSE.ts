import {Request, Response, Router} from 'express';

const router = Router();

const activeClients = new Set<Response>();

router.use('/', (req: Request, res: Response) => {
	console.log('client conntected');

	res.setHeader('Content-Type', 'text/event-stream');
	res.setHeader('Cash-Control', 'no-cashe');
	res.setHeader('Connection', 'keep-alive');
	res.flushHeaders();

	res.write(':ok\n\n');
	/* setInterval(() => {
		res.write(`data: ${JSON.stringify(new Date().toLocaleDateString())}\n\n`);
	}, 2000); */

	activeClients.add(res);

	req.on('close', () => {
		activeClients.delete(res);
	});
});

export const notifyAllClients = (data: Record<string, unknown>) => {
	const payload = `data: ${JSON.stringify(data)}\n\n`;
	activeClients.forEach((client) => {
		client.write(payload);
	});
};

export default router;
