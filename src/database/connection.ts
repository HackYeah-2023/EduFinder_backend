// db/connection.ts
import mysql from 'mysql2/promise';
import {config} from '../config';

const pool = mysql.createPool({
    host: config.DATABASE_HOST,
    user: config.DATABASE_USERNAME,
    password: config.DATABASE_PASSWORD,
    database: 'hackyeah2023',
    namedPlaceholders: true,
});

export function getDb() {
    return pool.getConnection();
}

export function updateRecord() {
    //
}

export default pool;
