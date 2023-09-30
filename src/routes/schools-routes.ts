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
//TODO: opcjonalne filrowanie po: city, county (powiat), type (rodzaj szkoły)
