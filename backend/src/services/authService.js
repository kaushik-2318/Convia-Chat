import axios from 'axios';
import { generateJWTToken } from './tokenService.js';

export const verifyreCAPTCHA = async (recaptchaToken) => {
    const { data } = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
            secret: process.env.GOOGLE_RECAPTCHA_SECRET,
            response: recaptchaToken,
        },
    });

    return data;
};

export const generateLoginTokens = async (userId, res) => {
    const access_token = await generateJWTToken(userId, '30m', process.env.JWT_ACCESS_SECRET);
    const refresh_token = await generateJWTToken(userId, '7d', process.env.JWT_REFRESH_SECRET);

    res.cookie('accessToken', access_token, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 60 * 1000,
        sameSite: 'none',
        priority: 'high',
    });

    res.cookie('refreshToken', refresh_token, {
        httpOnly: true,
        secure: true,
        path: '/api/auth/refresh-token',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
        priority: 'high',
    });

    return access_token;
};
