import {Router, Request, Response} from 'express';
import {signToken} from '../services/jwt.service';
import {UserRepository} from '../database/user/user.repository';
import {hash} from '../utils/hash';

const usersRouter = Router()
	// * dodawanie użytkownika - DZIAŁA
	.post('/', async (req, res) => {
		const {email, password} = req.body;
		if (!email || !password)
			return res.status(400).json({message: 'Email and password are required'});
		const user = await UserRepository.getOne(email);
		if (user)
			return res
				.status(400)
				.json({message: 'User with same email already exists'});
		await UserRepository.insertOne({email, password});
		const token = await signToken({email});
		res.json({token});
	})
	// * logowanie - DZIAŁA
	.post('/login', async (req: Request, res: Response) => {
		const {email, password} = req.body;
		if (!email || !password)
			return res.status(400).json({message: 'Email and password are required'});
		const user = await UserRepository.getOne(email);
		if (!user)
			return res
				.status(400)
				.json({message: 'User with this email does not exist'});
		if (user.password !== (await hash(password)))
			return res.status(400).json({message: 'Invalid password'});
		const token = await signToken({email: user.email});
		res.json({token});
	});

export default usersRouter;
