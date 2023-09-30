import {NextFunction, Request, Response} from 'express';
import {ErrorResponse} from '../@types/responses';
import {verifyToken} from '../services/jwt.service';

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
    res.status(404);
    const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
    next(error);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandlerMiddleware(
    err: Error,
    _req: Request,
    res: Response<ErrorResponse>,
    _next: NextFunction,
) {
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
}

export async function jwtVerifyMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization'] || (req.query['token'] as string);
    if (!token) {
        // Return 401
        res.status(401);
        res.json({
            message: 'Unauthorized',
        });
        return;
    }
    const verifyResult = await verifyToken(token).catch((error) => {
        res.status(401);
        res.json({
            message: 'Unauthorized',
        });
        return;
    });
    if (verifyResult) {
        res.locals.user_id = verifyResult.user_id;
        next();
    }
}
