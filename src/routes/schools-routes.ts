import express, {Request, Response} from 'express';
import {getDb} from '../database/connection';

const schoolsRouter = express.Router();
schoolsRouter.get('/', async (req: Request, res: Response) => {
    // woj, miasto, profil, rozszerzone przedmioty, jezyki
    const {name, city, region, languages} = req.query;

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
        'SELECT s.city FROM hackyeah2023.SCHOOLS s group by s.city',
    );
    result.cities = cities[0].map((city) => city.city);
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
