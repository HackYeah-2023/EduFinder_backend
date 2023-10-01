import express, {Request, Response} from 'express';
import {School} from '../@types/main';
import pool from '../database/connection';

const schoolsRouter = express.Router();

const foreignLanguages = [
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

const extendedSubjects = [
	'Biologia',
	'Chemia',
	'Matematyka',
	'Informatyka',
	'WOS',
	'Polski',
	'Historia',
];

const profession = [
	'Lekarz',
	'Programista',
	'Automatyk',
	'Prawnik',
	'Nauczyciel',
	'Kierownik',
	'Menadżer',
];

const profiles = ['Biol-Chem', 'Mat-Inf', 'Ekonomiczny', 'Prawo'];

schoolsRouter.get('/', async (req: Request, res: Response) => {
	try {
		const {name, city, region, languages, classes, extendedSubjects} =
			req.query;

		let query = 'SELECT * FROM `schools`';
		const terms: string[] = [];

		if (name) terms.push('name LIKE :name');
		if (city) terms.push('city LIKE :city');
		if (region) terms.push('region LIKE :region');

		const filters: Record<string, string[]> = {
			name: name ? [`%${name}%`] : [],
			region: region ? [`%${region}%`] : [],
			city: city ? [`%${city}%`] : [],
		};

		['languages', 'classes', 'extendedSubjects'].forEach((param, index) => {
			if (req.query[param]) {
				const values = JSON.parse(req.query[param] as string) || [];
				const paramTerms = values.map((value, i) => {
					const key = `${param.charAt(0).toLowerCase()}${index}${i}`;
					filters[key] = [`%${value}%`];
					return `${param} LIKE :${key}`;
				});
				if (paramTerms.length > 0) terms.push(`(${paramTerms.join(' OR ')})`);
			}
		});

		if (terms.length > 0) query += ` WHERE ${terms.join(' AND ')}`;

		const fullQuery = query;

		const data = await pool.execute(fullQuery, filters);

		let schools = data[0] as School[];

		['classes', 'extendedSubjects'].forEach(param => {
			if (req.query[param]) {
				const queryParam = JSON.parse(req.query[param] as string) || [];
				schools = schools.filter(school => {
					const dbParam = JSON.parse(school[param]);
					return queryParam.every(el => dbParam.includes(el));
				});
			}
		});

		res.json(schools);
	} catch (error) {
		res.status(500).json({message: 'Internal server error'});
	}
});

schoolsRouter.get('/options', async (req: Request, res: Response) => {
	// const db = await getDb();
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
		cities: [],
		foreign_languages: foreignLanguages,
		extendedSubjects: extendedSubjects,
		profession: profession,
		profiles: profiles,
	};

	const citiesQuery: any[][] = await pool.execute(
		'SELECT s.city FROM hackyeah2023.SCHOOLS s GROUP BY s.city'
	);
	result.cities = citiesQuery[0].map(city => city.city);

	['foreignLanguages', 'extendedSubjects', 'profession', 'profiles'].forEach(
		param => {
			result[param] = eval(param);
		}
	);

	res.json(result);
});

type Like = -1 | 1;

schoolsRouter.patch('/', async (req: Request, res: Response) => {
	const likes: Like = Number(req.query.likes) as Like;

	try {
		if (Number.isNaN(likes))
			return res.status(400).json({message: 'Likes must be a number'});
		if (likes !== 1 && likes !== -1)
			return res.status(400).json({message: 'Likes must be 1 or -1'});

		const {id} = req.query;
		const currLikes = (
			await pool.execute('SELECT `likes` FROM `schools` WHERE `id` = :id', {
				id,
			})
		)[0][0].likes;
		const sum = currLikes + likes;

		await pool.execute('UPDATE `schools` SET `likes` = :sum WHERE id = :id', {
			id,
			sum,
		});

		return res
			.status(200)
			.json({message: 'Likes has been updated', likesCount: sum});
	} catch (error) {
		console.error(error);
		return res
			.status(error.code === 'ER_WARN_DATA_OUT_OF_RANGE' ? 400 : 500)
			.json({
				message:
					error.code === 'ER_WARN_DATA_OUT_OF_RANGE'
						? 'Likes cannot be lower than 0'
						: 'Sorry, try again later',
			});
	} finally {
		res.end();
	}
});

export default schoolsRouter;
