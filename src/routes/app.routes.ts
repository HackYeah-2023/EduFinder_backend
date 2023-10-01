import {Router, Request, Response} from 'express';
// import {UserRepository} from 'src/database/user/user.repository';
const appRouter = Router().get('/ping', (_req: Request, res: Response) => {
	res.json({
		now: new Date(),
	});
});

export default appRouter;
