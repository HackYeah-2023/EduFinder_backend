import express from 'express';
import {getDb} from '../database/connection';

const schoolsRouter = express.Router();
schoolsRouter.get('/', async (_req, res) => {
    const db = await getDb();
    const data = await db.execute('SELECT * FROM SCHOOLS LIMIT 300');
    res.json(data[0]);
});

export default schoolsRouter;
