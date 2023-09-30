// create-users-table.ts

import {getDb} from '../connection';

async function createUsersTable() {
    const connection = await getDb();
    await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `);
    connection.release();
}

createUsersTable()
    .then(() => {
        console.log('Users table created successfully');
    })
    .catch((error) => {
        console.error('Error creating users table:', error);
    });
