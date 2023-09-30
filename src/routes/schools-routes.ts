import express, {Request, Response} from 'express';
import {getDb} from '../database/connection';

const schoolsRouter = express.Router();
schoolsRouter.get('/', async (req: Request, res) => {
    const {name} = req.query;
    const db = await getDb();
    const query = `SELECT * FROM SCHOOLS WHERE ${name ? 'name LIKE :name' : ''} LIMIT 300`;
    const data = await db.execute(query, {
        name: name ? `%${name}%` : null,
    });
    res.json(data[0]);
});

export default schoolsRouter;
//TODO: opcjonalne filrowanie po: city, county (powiat), type (rodzaj szkoły)
