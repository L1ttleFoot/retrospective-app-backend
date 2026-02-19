import {User} from '@prisma/types';
import bcrypt from 'bcryptjs';

import {prisma} from '../app';
import {ApiError} from '../utils/errorsHandler';
import {generateAccessToken, generateRefreshToken} from '../utils/jwtTokens';

class AuthSessionsServise {
	async register(user: User) {
		const {password, ...other} = user;
		const role = await prisma.role.findUnique({where: {value: 'USER'}});

		const existedUser = await prisma.user.findUnique({where: {username: user.username}});

		if (existedUser) {
			throw new ApiError(409, 'User with this username already exists');
		}

		if (!role) {
			throw new ApiError(500, 'Default role not found');
		}

		const hashedPassword = await bcrypt.hash(password, 7);

		return prisma.user.create({
			data: {password: hashedPassword, roles: {connect: [{value: role.value}]}, ...other},
		});
	}

	async login({username, password}: Pick<User, 'username' | 'password'>) {
		const user = await prisma.user.findUnique({where: {username}, include: {roles: true}});

		if (!user) {
			throw new ApiError(404, 'User not found');
		}

		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new ApiError(401, 'Invalid password');
		}

		const accessToken = generateAccessToken(user.id);
		const refreshToken = generateRefreshToken(user.id);

		return {accessToken, refreshToken, roles: user.roles, id: user.id};
	}
}

export default new AuthSessionsServise();
