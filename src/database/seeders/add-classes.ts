import {getDb} from '../connection';

(async () => {
	const classesData = [
		{
			name: 'Biol-Chem',
			subjects_extended: ['Biologia', 'Chemia'],
			points: 185,
			places: 20,
			classes: 2,
			subjects_included: ['Biologia', 'Chemia'],
			professions: ['Lekarz'],
		},
		{
			name: 'Mat-Inf',
			subjects_extended: ['Matematyka', 'Informatyka'],
			points: 165,
			places: 25,
			classes: 2,
			subjects_included: ['Matematyka', 'Informatyka'],
			professions: ['Programista', 'Automatyk'],
		},
		{
			name: 'Prawo',
			subjects_extended: ['Polski', 'Historia', 'WOK'],
			points: 150,
			places: 30,
			classes: 3,
			subjects_included: ['Polski', 'Historia', 'WOK'],
			professions: ['Prawnik', 'Nauczyciel'],
		},
		{
			name: 'Ekonomiczny',
			subjects_extended: ['Polski', 'Matematyka'],
			points: 110,
			places: 3,
			classes: 3,
			subjects_included: ['Polski', 'Matematyka'],
			professions: ['Kierownik', 'Menadżer'],
		},
	];
	const connection = await getDb();
	const schools: any[] = await connection.query(`SELECT * FROM schools`);
	console.log(schools[0]);
	for (const el of schools[0]) {
		for (const classData of classesData) {
			await connection.execute(
				`INSERT INTO classes (school_id, name, subjects_extended, points, places, classes, subjects_included, professions) VALUES (:school_id, :name, :subjects_extended, :points, :places, :classes, :subjects_included, :professions)`,
				{
					school_id: el.id,
					...classData,
				}
			);
		}
		//
	}
	console.log('done');
})();
