import express, {Request, Response} from 'express';
import {getDb} from '../database/connection';

const schoolsRouter = express.Router();
schoolsRouter.get('/', async (req: Request, res) => {
	const {name, city, county, type} = req.query;
	const db = await getDb();
	let query = 'SELECT * FROM `schools`';
	const terms = [];
	if (name) {
		terms.push('name LIKE :name');
	}
	if (city) {
		terms.push('city LIKE :city');
	}
	if (county) {
		terms.push('county LIKE :county');
	}
	if (type) {
		terms.push('type LIKE :type');
	}
	if (terms.length > 0) {
		query += 'WHERE ' + terms.join(' AND ');
	}

	const data = await db.execute(query, {
		name: name ? `%${name}%` : null,
		city: city ? `%${city}%` : null,
		county: county ? `%${county}%` : null,
		type: type ? `%${type}%` : null,
	});

	res.json(data[0]);
});

export default schoolsRouter;
