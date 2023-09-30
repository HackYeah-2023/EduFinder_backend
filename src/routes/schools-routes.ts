import express, {Request, Response} from 'express';
import {getDb} from '../database/connection';

const schoolsRouter = express.Router();
schoolsRouter.get('/', async (req: Request, res: Response) => {
	const {name, city, county, type, region} = req.query;
	console.log('REQ QUERY', req.query);
	const db = await getDb();
	let query = 'SELECT * FROM `schools`';
	const terms = [];

	if (name) {
		terms.push('name LIKE :name');
	}
	if (city) {
		terms.push('city LIKE :city');
	}
	if (region) {
		terms.push('region LIKE :region');
	}
	if()
	if (terms.length > 0) {
		query += ' WHERE ' + terms.join(' AND ');
	}

	const data = await db.execute(query, {
		name: name ? `%${name}%` : null,
		county: county ? `%${county}%` : null,
		region: region ? `%${region}%` : null,
	});

	console.log(query);
	res.json(data[0]);
});

schoolsRouter.get('/options', async (req: Request, res: Response) => {
	const db = await getDb();
	const result: Record<string, string[]> = {
		regions: [
			'Dolnośląskie',
			'Kujawsko-Pomorskie',
			'Lubelskie',
			'Lubuskie',
			'Łódzkie',
			'Małopolskie',
			'Mazowieckie',
			'Opolskie',
			'Podkarpackie',
			'Podlaskie',
			'Pomorskie',
			'Śląskie',
			'Świętokrzyskie',
			'Warmińsko-Mazurskie',
			'Wielkopolskie',
			'Zachodniopomorskie',
		],
	};
	const cities: any[][] = await db.execute(
		'SELECT s.city FROM hackyeah2023.SCHOOLS s group by s.city'
	);
	result.cities = cities[0].map(city => city.city);
	result.languages = [
		'Angielski',
		'Niemiecki',
		'Hiszpański',
		'Francuski',
		'Rosyjski',
		'Włoski',
		'Chiński',
		'Japoński',
		'Portugalski',
		'Arabski',
		'Koreański',
		'Turecki',
	];
	result.extended_subjects = ['Biologia', 'Chemia', 'Matematyka'];
	result.subjects_included = ['Biologia', 'Chemia', 'Matematyka'];
	result.profession = ['Lekarz', 'Programista', 'Prawnik'];

	res.json(result);
});

export default schoolsRouter;
