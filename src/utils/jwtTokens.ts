import jwt from 'jsonwebtoken';

import {Role, User} from '@/generated/prisma/client';

export const generateAccessToken = (id: User['id'], roles: Role['value'][]) => {
	return jwt.sign({id, roles}, process.env.ACCESS_TOKEN_SECRET || '', {expiresIn: '1h'});
};

export const generateRefreshToken = (id: User['id']) => {
	return jwt.sign({id}, process.env.REFRESH_TOKEN_SECRET || '', {expiresIn: '5d'});
};
