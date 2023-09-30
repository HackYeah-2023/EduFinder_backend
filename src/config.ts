// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-var-requires
require('dotenv').config();

export const config = {
    JWT_SECRET: process.env['JWT_SECRET'],
    WHOAMI: process.env['WHOAMI'],
    DATABASE_HOST: process.env['DATABASE_HOST'],
    DATABASE_USERNAME: process.env['DATABASE_USERNAME'],
    DATABASE_PASSWORD: process.env['DATABASE_PASSWORD'],
};
