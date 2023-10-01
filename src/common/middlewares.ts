import {NextFunction, Request, Response} from 'express';
import {ErrorResponse} from '../@types/responses';
import {verifyToken} from '../services/jwt.service';

export const notFoundMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	res.status(404);
	const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
	next(error);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandlerMiddleware = (
	err: Error,
	_req: Request,
	res: Response<ErrorResponse>,
	_next: NextFunction
) => {
	const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
	res.status(statusCode).json({
		message: err.message || 'Unknown error',
		stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
	});
};

export const jwtVerifyMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const token = req.headers['authorization'] || (req.query['token'] as string);
	if (!token) {
		// Return 401
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	}
	const verifyResult = await verifyToken(token).catch(error => {
		res.status(401).json({
			message: 'Unauthorized',
		});
		return;
	});
	if (verifyResult) {
		res.locals.email = verifyResult.email;
		next();
	}
};
