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
                error: `Failed to create discussion: ${(error as Error).message}`,
            });
        }
    }

    async login(req: Request<{}, {}, User>, res: Response) {
        try {
            const {accessToken, refreshToken} = await authService.login(req.body);

            res.cookie('accessToken', accessToken);
            res.cookie('refreshToken', refreshToken);

            res.json({username: req.body.username});
        } catch (error) {
            res.status(500).json({
                error: `Failed to create discussion: ${(error as Error).message}`,
            });
        }
    }

    refreshAccessToken(req: Request, res: Response) {
        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;

        if (!accessToken || !refreshToken) {
            res.sendStatus(403);
            return;
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET || '',
            async (err: jwt.VerifyErrors | null, payload: any) => {
                if (err || !payload) {
                    res.sendStatus(403);
                    return;
                }

                const accessToken = generateAccessToken(payload.id);
                const refreshToken = generateRefreshToken(payload.id);

                const user = await prisma.user.findUnique({where: {id: payload.id}});
                if (!user) {
                    res.sendStatus(404);
                    return;
                }

                res.cookie('accessToken', accessToken);
                res.cookie('refreshToken', refreshToken);
                res.json({username: user?.username});
            },
        );
    }

    logout(req: Request, res: Response) {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.sendStatus(200);
    }

    async getAllUsers(req: Request, res: Response) {
        const users = await authService.getAllUsers();

        res.json(users);
    }
}

export default new AuthController();
