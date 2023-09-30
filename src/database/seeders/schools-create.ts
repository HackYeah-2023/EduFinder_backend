import {getDb} from '../connection';

async function createUsersTable() {
    const connection = await getDb();
    await connection.query(`
    CREATE TABLE IF NOT EXISTS schools(
        id INT PRIMARY KEY,
        name VARCHAR(255),
        region VARCHAR(255),
        county VARCHAR(255),
        commune VARCHAR(255),
        city VARCHAR(255),
        street VARCHAR(255),
        number VARCHAR(255),
        zipCode VARCHAR(255),
        page VARCHAR(255),
        type VARCHAR(255),
        departments INT,
        mail VARCHAR(255),
        phone VARCHAR(255)
        foreign_languages TEXT, 
      )
    `);
    connection.release();
}

createUsersTable()
    .then(() => {
        console.log('Table created successfully');
    })
    .catch((error) => {
        console.error('Error creating table:', error);
    });
