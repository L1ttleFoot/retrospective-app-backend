import 'dotenv/config';
import {PrismaPg} from '@prisma/adapter-pg';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import {PrismaClient} from '../prisma/generated/prisma/client';
import router from './routes';

const app = express();

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});

export const prisma = new PrismaClient({adapter});

const allowedOrigins = [
	'http://localhost:3000',
	'http://localhost:3001',
	'https://retrospective-app-navy.vercel.app',
	'raspberry-pi.local:3000',
	'http://192.168.1.66:3000',
];

app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization'],
	}),
);

app.use(express.json());
app.use(cookieParser());
app.use('/api', router);
app.get('/', (_, res) => {
	res.status(200).json({message: 'Hello World'});
});
app.all('*', (_req, res) => {
	res.status(404).json({message: 'Not found'});
});

export default app;
