import { Redis } from '@upstash/redis';
import { AppError } from '../utils/AppError.js';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new AppError({
        message: 'Upstash Redis env variables are missing',
        statusCode: 500,
        code: 'UPSTASH_REDIS_ENV_MISSING',
    });
}

export const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
