import express, {Request, Response} from 'express';
import pool from '../database/connection';

const classesRouter = express.Router();
// * endpoint działa, ale zwraca pustą tablicę (tabela classes w bazie danych pusta)
classesRouter.get('/:school_id', async (req: Request, res: Response) => {
	const id = req.params.school_id;

	const data = (
		await pool.execute('SELECT * FROM CLASSES WHERE school_id=:id', {
			id,
		})
	)[0];
	res.json(data);
});

export default classesRouter;
