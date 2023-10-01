import {pbkdf2} from 'crypto';
import {promisify} from 'util';

const pbkdf2Async = promisify(pbkdf2);

export const hash = async (inputString: string): Promise<string> =>
	'SLDKFHDSL:KFHDSOIHFDSOIC<VJLKHDFS:JLHDSF' +
	(
		await pbkdf2Async(
			inputString,
			Buffer.from('SLDKFHDSL:KFHDSOIHFDSOIC<VJLKHDFS:JLHDSF', 'hex'),
			1e4,
			64,
			'sha512'
		)
	).toString('hex');
