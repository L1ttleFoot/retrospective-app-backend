import {Request, Response} from 'express';
import authService from '../services/auth.service';
import {User} from '@prisma/client';
import {generateAccessToken, generateRefreshToken} from '../helpers/jwtTokens';
import jwt from 'jsonwebtoken';
import {prisma} from '..';

class AuthController {
    async register(req: Request<{}, {}, User>, res: Response) {
        try {
            const user = await authService.register(req.body);
            res.json(user);
        } catch (error) {
            res.status(500).json({
                error: `Failed to create user: ${(error as Error).message}`,
            });
        }
    }

    async login(req: Request<{}, {}, User>, res: Response) {
        try {
            const {accessToken, refreshToken, roles, id} = await authService.login(req.body);

            res.cookie('refreshToken', refreshToken);

            res.json({id, username: req.body.username, token: accessToken, roles});
        } catch (error) {
            res.status(500).json({
                error: `Failed to login: ${(error as Error).message}`,
            });
        }
    }

    refreshAccessToken(req: Request, res: Response) {
        const accessToken = req.headers.authorization?.split(' ')[1];
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken || !refreshToken) {
            console.log('No access token or refresh token provided', 'accessToken:' + accessToken, 'refreshToken:' +refreshToken);
            res.sendStatus(403);
            return;
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || '',
            async (err: jwt.VerifyErrors | null, payload: any) => {
                if (err || !payload) {
                    console.log('Invalid refresh token');
                    res.sendStatus(403);
                    return;
                }

                const accessToken = generateAccessToken(payload.id);
                const refreshToken = generateRefreshToken(payload.id);

                const user = await prisma.user.findUnique({
                    where: {id: payload.id},
                    include: {roles: true},
                });
                if (!user) {
                    res.sendStatus(404);
                    return;
                }

                res.cookie('refreshToken', refreshToken);
                res.json({
                    id: user.id,
                    username: user?.username,
                    token: accessToken,
                    roles: user.roles,
                });
            },
        );
    }

    logout(_: Request, res: Response) {
        res.clearCookie('refreshToken');
        res.sendStatus(200);
    }
}

export default new AuthController();
