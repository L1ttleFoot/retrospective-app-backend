import {NextFunction, Request, Response} from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    /*  const authHeader = req.headers.authorization;

    const token = authHeader && authHeader.split(' ')[1]; */

    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        res.sendStatus(401);
        return;
    }

    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
        res.sendStatus(500);
        return;
    }

    jwt.verify(accessToken, secret, (err: jwt.VerifyErrors | null) => {
        if (err) {
            res.sendStatus(401);
            return;
        }

        next();
    });
};
