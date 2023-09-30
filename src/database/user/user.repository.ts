import {User} from 'src/@types/main';
import pool from '../connection';
import {ValidationError} from '../../common/error';
// import {hash} from 'src/utils/hash'; jakimś cudem ts-node nie widzi tego modułu
import bcrypt from 'bcrypt';
export const hash = async (password: string): Promise<string> => {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedEmail = await bcrypt.hash(password, salt);
	return hashedEmail;
};

export class UserRepository {
	//
	static async getOne(email: string) {
		const user = (
			await pool.execute('SELECT * FROM users WHERE email = :email', {
				email,
			})
		)[0][0];
		return user;
	}
	static async getAll() {
		const users = (await pool.execute('SELECT * FROM users'))[0];
		return users;
	}
	static async insertOne(user: User) {
		const {email, password} = user;
		await pool.execute(
			'INSERT INTO users (email, password) VALUE (:email, :password)',
			{
				email,
				password: await hash(password),
			}
		);
	}
	static async updateOne(user: User) {
		const {email, password} = user;
		await pool.execute(
			'UPDATE users SET password = :password WHERE email = :email',
			{
				email,
				password: await hash(password),
			}
		);
	}
	static async removeOne(email) {
		const dbUser = await UserRepository.getOne(email); //tu jest użytkownik z bazy
		if (dbUser) {
			await pool.execute('DELETE FROM users WHERE email = :email', {
				email,
			});
		} else throw new ValidationError(`User ${email} does not exist`);
	}
}
