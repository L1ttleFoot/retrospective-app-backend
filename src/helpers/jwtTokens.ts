import {User} from '@prisma/types';
import jwt from 'jsonwebtoken';

export const generateAccessToken = (id: User['id']) => {
	return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET || '', {expiresIn: '15m'});
};

export const generateRefreshToken = (id: User['id']) => {
	return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET || '', {expiresIn: '24h'});
};
