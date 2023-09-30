import express from 'express';
import {getDb} from '../database/connection';
import {signToken} from '../services/jwt.service';

const usersRouter = express.Router();
usersRouter.get('/', async (_req, res) => {
    const db = await getDb();
    const users = await db.execute('SELECT * FROM USERS');
    res.json(users[0]);
});

usersRouter.post('/', async (req, res) => {
    const db = await getDb();
    const {email, password} = req.body;
    if (!email || !password)
        return res.status(400).json({message: 'Email and password are required'});
    // Check if user with same email exists
    const existingUser: any[] = await db.execute('SELECT * FROM USERS WHERE email = ?', [email]);
    if (existingUser[0].length > 0)
        return res.status(400).json({message: 'User with same email already exists'});

    await db.execute('INSERT INTO USERS ( email, password) VALUES (?, ?)', [email, password]);
    // fetch user
    const user = await db.execute('SELECT * FROM USERS WHERE email = ?', [email]);
    const userData = user[0][0];

    const token = await signToken({user_id: userData.id});

    // const token =
    res.json({token});
});

usersRouter.post('/login', async (req, res) => {
    const db = await getDb();
    const {email, password} = req.body;
    if (!email || !password)
        return res.status(400).json({message: 'Email and password are required'});
    // Check if user with same email exists
    const existingUser: any[] = await db.execute('SELECT * FROM USERS WHERE email = ?', [email]);
    if (existingUser[0].length === 0)
        return res.status(400).json({message: 'User with this email does not exists'});

    const userData = existingUser[0][0];
    if (userData.password !== password) return res.status(400).json({message: 'Invalid password'});

    const token = await signToken({user_id: userData.id});

    // const token =
    res.json({token});
});

export default usersRouter;
