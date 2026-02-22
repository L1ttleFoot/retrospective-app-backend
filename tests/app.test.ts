import request from 'supertest';

import app from '../src/app';
import {prisma} from '../src/prisma';
import {generateAccessToken} from '../src/utils/jwtTokens';

afterAll(async () => {
	await prisma.$disconnect();
});

describe('GET /', () => {
	it('should return 200 and a welcome message', async () => {
		const res = await request(app).get('/');
		expect(res.statusCode).toBe(200);
		expect(res.body).toEqual({message: 'Hello World'});
	});
});

describe('GET /discussions', () => {
	const invalidUserId = '123';

	const invalidAuthToken = `Bearer ${generateAccessToken(invalidUserId)}`;

	//const validAuthToken = `Bearer ${generateAccessToken(validUserId)}`;

	it('should return 401', async () => {
		const res = await request(app).get('/api/discussions');
		expect(res.statusCode).toBe(401);
	});

	it('should return 404 and a welcome message', async () => {
		const res = await request(app).get('/api/discussions').set('authorization', invalidAuthToken);
		expect(res.statusCode).toBe(404);
		expect(res.body).toEqual({error: 'Failed to get discussions: User not found'});
	});

	/* it('should return 200 and a welcome message', async () => {
		const res = await request(app).get('/api/discussions').set('authorization', validAuthToken);
		expect(res.statusCode).toBe(200);
		expect(res.body.length).toBe(3);
	}); */
});
