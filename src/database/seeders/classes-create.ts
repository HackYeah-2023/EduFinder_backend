import {getDb} from '../connection';

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

createUsersTable()
    .then(() => {
        console.log('Table created successfully');
    })
    .catch((error) => {
        console.error('Error creating table:', error);
    });

// Nazwa klasy e.g. Biol-Chem
// Przedmioty rozszerzane - e.g. Matematyka, Fizyka, Chemia - JSON array - ["Matematyka", "Fizyka", "Chemia"]
// Punkty potrzebne na dostanie sie - e.g. 180
// Zawody po których ukończeniu można dostać się do Pracy - e.g. Programista, Lekarz, Prawnik - JSON array - ["Programista", "Lekarz", "Prawnik"]
// Przedmioty wliczane do punktów - e.g. Matematyka, Fizyka, Chemia - JSON array - ["Matematyka", "Fizyka", "Chemia"]
// Liczba klas - e.g. 3
// Liczba miejsc w klasie - e.g. 30
