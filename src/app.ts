import express from 'express';
import cors from 'cors';
import appRouter from './routes/app.routes';
import {errorHandlerMiddleware, notFoundMiddleware} from './common/middlewares';
import {MessageResponse} from './@types/responses';
import usersRouter from './routes/users.routes';
import {config} from './config';
import schoolsRouter from './routes/schools-routes';
import classesRouter from './routes/classes-routes';

const app = express();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(cors());

app.use(express.json());

app.get<Request, MessageResponse>('/', (_req, res) => {
    res.json({message: config.WHOAMI});
});
app.use('/app', appRouter);
app.use('/users', usersRouter);
app.use('/schools', schoolsRouter);
app.use('/classes', classesRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;
