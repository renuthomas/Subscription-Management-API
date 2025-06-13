import {config} from 'dotenv';

config({path:`.env.${process.env.NODE_ENV || 'development'}.local`});

export const {
    PORT,
    SERVER_URL,
    EMAIL,
    EMAIL_PASSWORD,
    DB_URI,
    NODE_ENV,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    ARCJET_KEY,
    ARCJET_ENV,
    QSTASH_TOKEN,
    QSTASH_URL,
    QSTASH_CURRENT_SIGNING_KEY,
    QSTASH_NEXT_SIGNING_KEY
}=process.env;