import express from 'express';
import {jwtVerifyMiddleware} from '../common/middlewares';
import {signToken} from '../services/jwt.service';
import {getDb} from '../database/connection';
const appRouter = express.Router();
import * as crypto from 'crypto';

appRouter.get('/ping', (_req, res) => {
    res.json({
        now: new Date(),
    });
});

appRouter.get('/demoAuth/:user_id', async (req, res) => {
    const db = await getDb();

    const {user_id} = req.params;

    // Check if user exists
    const user = await db.execute('SELECT * FROM USERS WHERE id=:user_id', {
        user_id,
    });

    const record = user[0] as any[];

    if (!record.length) {
        // generate random string
        const random = crypto.randomUUID();
        await db.execute('INSERT INTO users (id,email,password) VALUES (:id,:email,:password)', {
            id: user_id,
            email: random,
            password: random,
        });
    }

    const token = await signToken({
        user_id: req.params.user_id,
    });

    res.json({
        token,
    });
});

appRouter.get('/checkin', jwtVerifyMiddleware, (_req, res) => {
    res.json({
        message: 'Authenticated',
    });
});

export default appRouter;
