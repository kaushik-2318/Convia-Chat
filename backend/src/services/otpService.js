import { AppError } from '../utils/AppError.js';
import { generateOtp } from '../utils/otpUtils.js';
import { redis } from '../config/upstash.js';
import crypto from 'crypto';
import { transporter } from './mailer.js';
import otpMailTemplate from '../templates/otpMail.js';

export const sendOtpService = async (user) => {
    try {
        const rateKey = `otp:rate:${user.email}`;

        const rate = await redis.get(rateKey);
        const timeLeft = await redis.ttl(rateKey);

        if (rate) {
            throw new AppError({
                message: `Please wait ${timeLeft > 0 ? timeLeft : 60} seconds before requesting a new OTP`,
                statusCode: 429,
                code: 'OTP_REQUEST_COOLDOWN',
                data: { timeLeft: timeLeft > 0 ? timeLeft : 60 },
            });
        }

        await redis.set(rateKey, '1', { ex: 60 });

        const token = crypto.randomBytes(32).toString('hex');

        const otp = generateOtp();

        await redis.set(
            `verify:${token}`,
            JSON.stringify({
                name: user.firstName,
                userId: user._id,
                email: user.email,
                otp,
                attempts: 0,
            }),
            { ex: 5 * 60 },
        );

        const emailDetails = {
            from: `Convia Chat<${process.env.SMTP_EMAIL}>`,
            to: user.email,
            subject: "Convia Chat - Here's your OTP",
            html: otpMailTemplate(user.firstName, otp),
        };

        await transporter.sendMail(emailDetails);

        return { success: true, message: 'OTP sent successfully', token };
    } catch (error) {
        throw new AppError({
            message: error.message || 'Failed to send OTP. Please try again after some time.',
            statusCode: error.statusCode || 500,
            code: error.code || 'OTP_SEND_FAILED',
            data: error.data,
        });
    }
};

export const resendOTPService = async (token) => {
    try {
        const data = await redis.get(`verify:${token}`);
        const ttl = await redis.ttl(`verify:${token}`);

        if (!data || ttl <= 0) {
            throw new AppError({
                message: 'OTP session has expired. Please login again.',
                statusCode: 400,
                code: 'TOKEN_EXPIRED',
            });
        }

        const rateKey = `otp:rate:${data.email}`;

        const rate = await redis.get(rateKey);
        const timeLeft = await redis.ttl(rateKey);

        if (rate) {
            throw new AppError({
                message: `Please wait ${timeLeft > 0 ? timeLeft : 60} seconds before requesting a new OTP`,
                statusCode: 429,
                code: 'OTP_REQUEST_COOLDOWN',
                data: { timeLeft: timeLeft > 0 ? timeLeft : 60 },
            });
        }

        await redis.set(rateKey, '1', { ex: 60 });

        const otp = generateOtp();

        await redis.set(
            `verify:${token}`,
            JSON.stringify({
                name: data.name,
                userId: data.userId,
                email: data.email,
                otp,
                attempts: 0,
            }),
            { ex: ttl },
        );

        const emailDetails = {
            from: `Convia Chat<${process.env.SMTP_EMAIL}>`,
            to: data.email,
            subject: "Convia Chat - Here's your OTP",
            html: otpMailTemplate(data.name, otp),
        };

        await transporter.sendMail(emailDetails);

        return { success: true, message: 'OTP sent successfully.' };
    } catch (error) {
        throw new AppError({
            message: error.message || 'Failed to resend OTP. Please try again after some time.',
            statusCode: error.statusCode || 500,
            code: error.code || 'OTP_RESEND_FAILED',
            data: error.data,
        });
    }
};
