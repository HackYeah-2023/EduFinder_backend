import pool from '../connection';
import {foreign_languages} from './fill-classes';

// Function to generate a random natural number from 3 to 6
function generateRandomNaturalNumber(): number {
    const min = 3;
    const max = 6;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to randomly select languages and return the result as JSON
async function getRandomLanguages(): Promise<string> {
    const numberOfLanguages = generateRandomNaturalNumber();
    const selectedLanguages: string[] = [];

    for (let i = 0; i < numberOfLanguages; i++) {
        const randomIndex = Math.floor(Math.random() * foreign_languages.length);
        const selectedLanguage = foreign_languages[randomIndex];
        selectedLanguages.push(selectedLanguage);
    }

    const jsonSelectedLanguages = JSON.stringify(selectedLanguages);
    return jsonSelectedLanguages;
}
const insertAll = async () => {
    const [data] = await pool.execute('SELECT COUNT(*) FROM schools');
    const tableLength = data[0]['COUNT(*)'];
    const firstId = (await pool.execute('SELECT id FROM schools ORDER BY id ASC LIMIT 1'))[0][0].id;
    console.log(firstId);
    let id = 0;
    for (let i = 0; i < tableLength; i++) {
        const randomLanguages = await getRandomLanguages();
        // console.log('RANDOM LANGUAGES ' + randomLanguages);
        // console.log('INDEX (i) ' + i);
        if (i === 0) id = firstId;
        await pool.execute(
            'UPDATE schools SET foreign_languages = :randomLanguages WHERE id = :id',
            {
                randomLanguages: randomLanguages,
                id: id++, // Add 1 to the ID to start from 1 instead of 0
            },
        );
    }
};
