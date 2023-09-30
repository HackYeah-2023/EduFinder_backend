import {User} from 'src/@types/main';
import pool from './connection';
type SchoolsEntity = 
export class SchoolsRepository {
	// static async getOne(id: string): Promise<User | null> {}
    static async getMany(req: Request) {
    //     const query = `SELECT * FROM SCHOOLS WHERE ${name ? 'name LIKE :name' : ''} LIMIT 300`;
    // const data = await db.execute(query, {
    //     name: name ? `%${name}%` : null,
    // });
    // res.json(data[0]);
    }
}
