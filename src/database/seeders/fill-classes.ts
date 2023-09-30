import pool, {getDb} from '../connection';
async function createUsersTable() {
	const connection = await getDb();
	await connection.query(`
    CREATE TABLE IF NOT EXISTS classes(
        id INT PRIMARY KEY,
        school_id INT,
        name VARCHAR(255),
        subjects_extended TEXT,
        points INT,
        places INT,
        classes INT,
        subjects_included TEXT,
        professions TEXT
    )`);
	connection.release();
}
const getAllSchools = async () => {
	const [results] = await pool.execute('SELECT * FROM `schools`');
	return results;
};
/*


update foreign languages (3 do 6 losowych języków dla każdego, tablica JSON)

*/
export const foreign_languages: string[] = [
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

// Calling the insertAll function

createUsersTable()
	.then(() => {
		console.log('Table created successfully');
	})
	.catch(error => {
		console.error('Error creating table:', error);
	});
