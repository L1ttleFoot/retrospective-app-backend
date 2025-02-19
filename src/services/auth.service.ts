import {User} from '@prisma/client';
import bcrypt from 'bcryptjs';
import {prisma} from '..';
import {generateAccessToken, generateRefreshToken} from '../helpers/jwtTokens';

class AuthServise {
    async register(user: User) {
        const {password, ...other} = user;
        const role = await prisma.role.findUnique({where: {value: 'USER'}});

        if (!role) {
            throw new Error('Default role not found');
        }

        const hashedPassword = await bcrypt.hash(password, 7);

        return prisma.user.create({
            data: {
                password: hashedPassword,
                roles: {connect: [{value: role.value}]},
                ...other,
            },
        });
    }

    async login({username, password}: Pick<User, 'username' | 'password'>) {
        const user = await prisma.user.findUnique({
            where: {username},
            include: {roles: true},
        });

        console.log(user);

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        return {accessToken, refreshToken};
    }

    getAllUsers() {
        return prisma.user.findMany();
    }
}

export default new AuthServise();
