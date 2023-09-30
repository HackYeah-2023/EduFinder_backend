import pool from '../connection';

interface Question {
	question: string;
	answer: string;
}
const questions: Question[] = [
	{
		question: 'Czy podoba się panu ta szkoła?',
		answer: 'Tak.',
	},
	{
		question: 'Czy jest pan zadowolony z poziomu nauczania?',
		answer: 'Tak.',
	},
	{
		question: 'Czy kadra wypełnia swoje obowiązki rzetelnie?',
		answer: 'Tak',
	},
];

const questionsStringified: string = JSON.stringify(questions);
// console.log('QUESTIONS STRINGIFIED AS STRING', String(questionsStringified));
// const insertQuestionsIntoDb = async () => {
// 	const numberOfRecords: number = (
// 		await pool.execute('SELECT COUNT(*) FROM schools')
// 	)[0][0]['COUNT(*)'];
// 	const firstId = (
// 		await pool.execute('SELECT id FROM schools ORDER BY id ASC LIMIT 1')
// 	)[0][0].id;
// 	let id = 0;
// 	for (let i = 0; i < numberOfRecords; i++) {
// 		if (i === 0) id = firstId;
// 		await pool.execute(
// 			`INSERT INTO schools ('faq') VALUE (${questionsStringified})`
// 		);
// 	}
// 	pool.end();
// };
// insertQuestionsIntoDb();
const insertQuestionsIntoDb = async () => {
	const numberOfRecords = (
		await pool.execute('SELECT COUNT(*) FROM schools')
	)[0][0]['COUNT(*)'];

	const firstId = (
		await pool.execute('SELECT id FROM schools ORDER BY id ASC LIMIT 1')
	)[0][0].id;

	let id = 0;

	for (let i = 0; i < numberOfRecords; i++) {
		if (i === 0) id = firstId;

		await pool.execute(
			'UPDATE schools SET faq = :questionsStringified WHERE id = :id',
			{questionsStringified, id: id++}
		);
	}

	pool.end();
};

insertQuestionsIntoDb();
