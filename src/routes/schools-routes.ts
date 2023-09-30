import express, {Request, Response} from 'express';
import {getDb} from '../database/connection';

const schoolsRouter = express.Router();
schoolsRouter.get('/', async (req: Request, res) => {
	const {name} = req.query;
	console.log(name);
	const db = await getDb();
	const data = await db.execute(
		`SELECT * FROM SCHOOLS WHERE ${name ? 'name LIKE %123%' : ''} LIMIT 300`,
		req.query
	);
	res.json(data[0]);
});

export default schoolsRouter;
//TODO: opcjonalne filrowanie po: city, county (powiat), type (rodzaj szkoły)
