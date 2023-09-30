import {getDb} from '../connection';

async function createUsersTable() {
    const connection = await getDb();
    await connection.query(`
        ALTER TABLE schools ADD languages TEXT NULL;
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
