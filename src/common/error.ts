import {Request, Response} from 'express';

class ValidationError extends Error {}

const handleError = (
	err: Error | ValidationError,
	req: Request,
	res: Response
) => {
	console.error(err);

	res.status(err instanceof ValidationError ? 400 : 500).json({
		message:
			err instanceof ValidationError
				? err.message
				: 'Przepraszamy, spróbuj ponownie za kilka minut.',
	});
};

export {handleError, ValidationError};
