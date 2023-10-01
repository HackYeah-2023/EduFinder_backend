import express, {Request, Response} from 'express';
import pool, {getDb} from '../database/connection';
import {School} from '../@types/main';
import {ValidationError} from '../common/error';

export const foreign_languages = [
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
export const extended_subjects = [
	// Biol-Chem
	'Biologia',
	'Chemia',
	// Mat fiz,inf
	'Matematyka',
	'Informatyka',
	// Prawo, ekonomiczny
	'WOS',
	'Polski',
	'Historia',
];
export const profession = [
	// Biol-Chem
	'Lekarz',
	// Mat fiz,inf
	'Programista',
	'Automatyk',
	// Prawo
	'Prawnik',
	'Nauczyciel',
	// Ekonomiczny
	'Kierownik',
	'Menadżer',
];
export const profiles = ['Biol-Chem', 'Mat-Inf', 'Ekonomiczny', 'Prawo'];

const schoolsRouter = express.Router();
schoolsRouter.get('/', async (req: Request, res: Response) => {
	try {
		// woj, miasto, profil, rozszerzone przedmioty, jezyki
		const {name, city, region, languages, classes, extended_subjects} =
			req.query;

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

		const lanFilters = {};
		const lanTerms = [];
		let lanTermsString = '';
		if (languages) {
			const parsed = JSON.parse((languages as string) || '');
			let counter = 0;
			for (const el of parsed) {
				const key = `lan${counter}`;
				lanTerms.push(`foreign_languages like :${key}`);
				lanFilters[`lan${counter}`] = `%${el}%`;
				counter++;
			}
			lanTermsString = `(${lanTerms.join(' OR ')})`;
		}

		if (terms.length > 0 || lanTermsString) {
			query += ' WHERE ' + terms.join(' AND ');
			if (lanTermsString && terms.length) {
				query += ' AND ';
			}
		}

		const fullQuery = query + lanTermsString;

		const data = await db.execute(fullQuery, {
			name: name ? `%${name}%` : null,
			region: region ? `%${region}%` : null,
			city: city ? `%${city}%` : null,
			...lanFilters,
		});
		let schools = data[0] as School[];
		if (classes) {
			const query_classes = JSON.parse((classes as string) || '');
			const filtered = schools.filter(school => {
				// parsed is ['Biol-Chem', 'Mat-Inf', 'Ekonomiczny', 'Prawo']
				// school.classes is ['Biol-Chem', 'Mat-Inf']
				const db_classes = JSON.parse(school.classes);

				for (const el of query_classes) {
					if (!db_classes.includes(el)) {
						console.log(query_classes, el, 'tu');
						return false;
					}
				}
				return true;
			});
			schools = filtered;
		}
		if (extended_subjects) {
			const query_extended_subjects = JSON.parse(
				(extended_subjects as string) || ''
			);
			const filtered = schools.filter(school => {
				// parsed is ['Biol-Chem', 'Mat-Inf', 'Ekonomiczny', 'Prawo']
				// school.classes is ['Biol-Chem', 'Mat-Inf']
				const db_extended_subjects = JSON.parse(school.extended_subjects);

				for (const el of query_extended_subjects) {
					if (!db_extended_subjects.includes(el)) {
						return false;
					}
				}
				return true;
			});
			schools = filtered;
		}

		res.json(schools);
	} catch (error) {
		res.status(500).json({message: 'Internal server error'});
	}
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
	result.foreign_languages = foreign_languages;
	result.extended_subjects = extended_subjects;
	result.profession = profession;
	result.profiles = profiles;

	res.json(result);
});
type Like = -1 | 1;
schoolsRouter.patch('/', async (req: Request, res: Response) => {
	let likes: Like = Number(req.query.likes) as unknown as Like;

	try {
		if (Number.isNaN(likes))
			return res.status(400).json({message: 'Likes must be a number'});
		if (likes !== 1 && likes !== -1)
			return res.status(400).json({message: 'Likes must be 1 or -1'});
		const {id} = req.query;
		const currLikes = (
			await pool.execute('SELECT `likes` FROM `schools` WHERE `id` = :id', {id})
		)[0][0].likes;

		const sum = currLikes + likes;
		console.log('SUM: ', sum, ' type: ', typeof sum);

		await pool.execute('UPDATE `schools` SET `likes` = :sum WHERE id = :id', {
			id,
			sum,
		});
		return res
			.status(200)
			.json({message: 'Likes has been updated', likesCount: sum});
	} catch (err) {
		console.log(err);
		return res
			.status(err.code === 'ER_WARN_DATA_OUT_OF_RANGE' ? 400 : 500)
			.json({
				message:
					err.code === 'ER_WARN_DATA_OUT_OF_RANGE'
						? 'Likes cannot be lower than 0'
						: 'Sorry, try again later',
			});
	} finally {
		res.end();
	}
});

export default schoolsRouter;
