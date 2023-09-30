import express from 'express';
import {getDb} from '../database/connection';

const classesRouter = express.Router();
classesRouter.get('/:school_id', async (req, res) => {
    const id = req.params.school_id;

    const db = await getDb();
    const data = await db.execute('SELECT * FROM CLASSES WHERE school_id=:id', {
        id,
    });
    res.json(data[0]);
});

export default classesRouter;
