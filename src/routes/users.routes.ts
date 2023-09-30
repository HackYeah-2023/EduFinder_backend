import {Router, Request, Response} from 'express';
import {User} from 'src/@types/main';
import {UserRepository} from 'src/database/user/user.repository';
import {hash} from 'src/utils/hash';
export const userRouter = Router()
	.get('/', async (req: Request, res: Response) => {
		const {email, password} = req.body;
		const user: User = await UserRepository.getOne(email);
		if (!user) return res.status(404).json({message: 'User not found'});
		const passwordHash = await hash(password);
		if (user.password !== passwordHash)
			return res.status(401).json({message: 'Incorrect password'});
		return res.status(200).json(user);
	})
	.post('/', async (req: Request, res: Response) => {
		const {email, password} = req.body;
		const userExists = await UserRepository.getOne(email);
		if (userExists)
			return res.status(400).json({message: 'User already exists'});
		//wiadomo, że użytkownik tu nie istnieje
		await UserRepository.insertOne({email, password});
		res.status(201).json({message: 'User successfully created'});
	});
