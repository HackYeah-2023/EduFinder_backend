import express from 'express';
import {getDb} from '../database/connection';

const usersRouter = express.Router();
usersRouter.get('/', async (_req, res) => {
    const db = await getDb();
    const users = await db.execute('SELECT * FROM USERS');
    res.json(users[0]);
});

export default usersRouter;
