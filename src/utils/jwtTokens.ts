import jwt from 'jsonwebtoken';

import {User} from '@/generated/prisma/client';

export const generateAccessToken = (id: User['id']) => {
	return jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET || '', {expiresIn: '1h'});
};

export const generateRefreshToken = (id: User['id']) => {
	return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET || '', {expiresIn: '5d'});
};
