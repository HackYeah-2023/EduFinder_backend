import bcrypt from 'bcrypt';
export const hash = async (password: string): Promise<string> => {
	const saltRounds = 10;
	const salt = await bcrypt.genSalt(saltRounds);
	const hashedEmail = await bcrypt.hash(password, salt);
	return hashedEmail;
};
