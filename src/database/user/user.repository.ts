import {User} from 'src/@types/main';
import pool from '../connection';
import bcrypt from 'bcrypt';
import {ValidationError} from '../../common/error';

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
const email: string = 'john@gmail.com';
const password: string = 'Abcdef123!';
function validateMail(email: string) {
	const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
	if (!expression.test(email)) {
		return 'Invalid email address';
	}
	return false;
}

function validatePassword(password: string) {
	const bigRegExp: RegExp = /^(?=.*?[A-Z])$/i;
	if (!bigRegExp.test(password)) {
		return [false, 'Password Needs at least 1 uppercase letter'];
	}
	const specialRegExp: RegExp = /^(?=.*?[#?!@$%^&*-])$/i;
	if (!specialRegExp.test(password)) {
		return [false, 'Password Needs at least 1 special character (#?!@$%^&*-)'];
	}
	const numRegExp: RegExp = /^(?=.*?[0-9])$/i;
	if (!numRegExp.test(password)) {
		return [false, 'Password Needs at least 1 number'];
	}
	const smallRegExp: RegExp = /^(?=.*?[a-z])$/i;
	if (!smallRegExp.test(password)) {
		return [false, 'Password Needs at least 1 lowercase letter'];
	}
	const lengthRegExp: RegExp = /^().{8,}$/i;
	if (!lengthRegExp.test(password)) {
		return [false, 'Password Needs to be at least 8 characters long'];
	}
	return [true, 'Valid'];
}

function validateRegister(email: string, password: string){
    const emailValid = validateMail(email);
    const passwordValid = validatePassword(password);

    return {
        valid: (emailValid[0] && passwordValid[0]),
        emailLog: emailValid[1],
        passwordLog: passwordValid[1]
    }
}

console.log(validateRegister(email, password));
