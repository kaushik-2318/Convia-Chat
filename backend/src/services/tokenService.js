import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export const verifyJWTToken = async (token, key, message) => {
    if (!token) {
        throw new AppError({
            message: 'Token is required',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }
    try {
        const tokenPayload = jwt.verify(token, key);
        return tokenPayload;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError({
                message: message || 'Session expired. Please login again.',
                statusCode: 401,
                code: 'TOKEN_EXPIRED',
            });
        }

        throw new AppError({
            message: message || 'Invalid authentication token.',
            statusCode: 401,
            code: 'INVALID_TOKEN',
        });
    }
};

export const generateJWTToken = async (payload, expiresIn, secret) => {
    let token = jwt.sign(payload, secret, { expiresIn });
    return token;
};
