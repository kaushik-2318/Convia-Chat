import UserModel from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { isDisposableEmail } from '../utils/checkDispose.js';
import { filterObj } from '../utils/filterObj.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { verifyreCAPTCHA } from '../services/authService.js';
import { generateJWTToken, verifyJWTToken } from '../services/tokenService.js';
import { redis } from '../config/upstash.js';
import { resendOTPService, sendOtpService } from '../services/otpService.js';
import resetPasswordTemplate from '../templates/resetPassword.js';
import crypto from 'crypto';
import { transporter } from '../services/mailer.js';

const isProduction = process.env.NODE_ENV === 'production';

const generateLoginTokens = async (userId, res) => {
    const accessToken = await generateJWTToken({ userId }, '1d', process.env.JWT_ACCESS_SECRET);
    const refreshToken = await generateJWTToken({ userId }, '30d', process.env.JWT_REFRESH_SECRET);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: 'none',
    });

    return accessToken;
};

export const login = catchAsync(async (req, res, next) => {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password) {
        throw new AppError({
            message: 'Email and Password are required',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }

    const filteredBody = filterObj({ email, password }, 'email', 'password');

    //  #Captch
    // const reCAPTCHA = await verifyreCAPTCHA(recaptchaToken);
    // if (!reCAPTCHA.success) {
    //     throw new AppError({
    //         message: 'reCAPTCHA failed, please try again',
    //         statusCode: 400,
    //         code: 'RECAPTCHA_FAILED',
    //     });
    // }

    const user = await UserModel.findOne({ email: filteredBody.email }).select('+password');

    if (!user) {
        throw new AppError({
            message: 'Incorrect Email or Password',
            statusCode: 404,
            code: 'INVALID_CREDENTIALS',
        });
    }

    const isPasswordValid = await user.correctPassword(password, user.password);

    if (!isPasswordValid) {
        throw new AppError({
            message: 'Incorrect Email or Password',
            statusCode: 404,
            code: 'INVALID_CREDENTIALS',
        });
    }

    if (!user.verified) {
        const resp = await sendOtpService(user);

        res.cookie('verifyToken', resp.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 5 * 60 * 1000,
        });

        throw new AppError({
            message: `Hey ${user.firstName}, Please verify your account.`,
            statusCode: 403,
            code: 'EMAIL_NOT_VERIFIED',
        });
    }

    const access_token = await generateLoginTokens(user._id, res);

    return res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        data: {
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar,
                email: user.email,
                activityStatus: user.activityStatus,
                onlineStatus: user.onlineStatus,
                token: access_token,
                verified: user.verified,
            },
        },
    });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
    try {
        const token = req.cookies.verifyToken;
        const { otp, recaptchaToken } = req.body;

        // #Captcha
        // const reCAPTCHA = await verifyreCAPTCHA(recaptchaToken);
        // if (!reCAPTCHA.success) {
        //     throw new AppError({
        //         message: "reCAPTCHA failed, please try again",
        //         statusCode: 400,
        //         code: "RECAPTCHA_FAILED",
        //     });
        // }

        if (!token) {
            throw new AppError({
                message: 'Session expired, Please try again.',
                statusCode: 400,
                code: 'TOKEN_EXPIRED',
            });
        }

        if (!otp) {
            throw new AppError({
                message: 'OTP is required',
                statusCode: 400,
                code: 'OTP_REQUIRED',
            });
        }

        const data = await redis.get(`verify:${token}`);

        if (!data) {
            throw new AppError({
                message: 'OTP expired or already used',
                statusCode: 400,
                code: 'OTP_EXPIRED',
            });
        }

        if (data.otp !== otp) {
            data.attempts = (data.attempts || 0) + 1;

            if (data.attempts >= 5) {
                await redis.del(`verify:${token}`);
                res.clearCookie('verifyToken', { httpOnly: true, secure: true, sameSite: 'None' });
                await redis.del(`otp:rate:${data.email}`);
                throw new AppError({
                    message: 'Verify attempts exceeded. Please login again to request a new OTP',
                    statusCode: 429,
                    code: 'OTP_VERIFY_ATTEMPTS_EXCEEDED',
                });
            }

            const ttl = await redis.ttl(`verify:${token}`);
            if (ttl > 0) {
                await redis.set(`verify:${token}`, JSON.stringify(data), { ex: ttl });
            }

            throw new AppError({
                message: 'Incorrect OTP',
                statusCode: 401,
                code: 'INVALID_OTP',
            });
        }

        const user = await UserModel.findOne({ email: data.email });

        if (!user) {
            throw new AppError({
                message: 'Invalid Email. Try registering or logging in again.',
                statusCode: 400,
                code: 'INVALID_EMAIL',
            });
        }

        if (user.verified) {
            throw new AppError({
                message: 'User already verified. Please login.',
                statusCode: 409,
                code: 'USER_ALREADY_VERIFIED',
            });
        }

        user.verified = true;

        await user.save();

        await redis.del(`verify:${token}`);
        res.clearCookie('verifyToken', { httpOnly: true, secure: true, sameSite: 'None' });

        const access_token = await generateLoginTokens(user._id, res);

        return res.status(200).json({
            success: true,
            message: 'OTP verified.',
            data: {
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                    email: user.email,
                    activityStatus: user.activityStatus,
                    onlineStatus: user.onlineStatus,
                    token: access_token,
                    verified: user.verified,
                },
            },
        });
    } catch (error) {
        await redis.del(`verify:${token}`);
        res.clearCookie('verifyToken', { httpOnly: true, secure: true, sameSite: 'None' });
        await redis.del(`otp:rate:${data.email}`);
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError({
                message: error.message || 'OTP verification failed, Please try again.',
                statusCode: 400,
                code: 'OTP_VERIFICATION_FAILED',
            });
        }
    }
});

export const resendOTP = catchAsync(async (req, res, next) => {
    try {
        const token = req.cookies.verifyToken;

        if (!token) {
            throw new AppError({
                message: 'Session expired, Please try again.',
                statusCode: 400,
                code: 'TOKEN_EXPIRED',
            });
        }

        const resp = await resendOTPService(token);

        if (!resp.success) {
            throw new AppError({
                message: resp.message,
                statusCode: 400,
                code: 'OTP_RESEND_FAILED',
            });
        }

        return res.status(200).json({
            success: resp.success,
            message: resp.message,
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError({
                message: error.message || 'OTP verification failed, Please try again.',
                statusCode: 400,
                code: 'OTP_VERIFICATION_FAILED',
            });
        }
    }
});

export const checkEmail = catchAsync(async (req, res, next) => {
    const { email, firstName, lastName } = req.body;

    if (!firstName || !lastName || !email) {
        throw new AppError({
            message: 'All fields are required',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }

    if (
        !validator.isLength(firstName, { min: 3, max: 16 }) ||
        !validator.isLength(lastName, { min: 3, max: 16 })
    ) {
        throw new AppError({
            message: 'First Name and Last Name must be between 3 and 16 characters',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }

    if (!validator.isAlpha(firstName) || !validator.isAlpha(lastName)) {
        throw new AppError({
            message: 'First Name and Last Name can only contain alphabetic characters',
            statusCode: 400,
            code: 'INVALID_NAME_FORMAT',
        });
    }

    if (!validator.isEmail(email)) {
        throw new AppError({
            message: 'Invalid Email',
            statusCode: 400,
            code: 'INVALID_EMAIL',
        });
    }

    const isDisposable = await isDisposableEmail(email);

    if (isDisposable) {
        throw new AppError({
            message: 'Disposable emails are not allowed',
            statusCode: 400,
            code: 'DISPOSABLE_EMAIL_NOT_ALLOWED',
        });
    }

    const existing_user = await UserModel.findOne({ email: email });

    if (existing_user) {
        throw new AppError({
            message: 'Email is already registered. Please Login.',
            statusCode: 409,
            code: 'EMAIL_ALREADY_REGISTERED',
        });
    }

    const token = jwt.sign(
        { data: { email, firstName, lastName }, purpose: 'REGISTER' },
        process.env.JWT_REGISTER_EMAIL_SECRET,
        {
            expiresIn: '5m',
        },
    );

    res.cookie('registerToken', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'None',
        maxAge: 5 * 60 * 1000,
    });

    return res.status(200).json({
        success: true,
        message: 'Email is available for registration.',
    });
});

export const register = catchAsync(async (req, res, next) => {
    try {
        const registerToken = req.cookies.registerToken;
        const { password, confirmPassword, recaptchaToken } = req.body;

        // #Captcha
        // if (!recaptchaToken) {
        //     throw new AppError({
        //         message: 'reCAPTCHA token is required',
        //         statusCode: 400,
        //         code: 'VALIDATION_ERROR',
        //     });
        // }

        // const reCAPTCHA = await verifyreCAPTCHA(recaptchaToken);

        // if (!reCAPTCHA.success) {
        //     throw new AppError({
        //         message: 'reCAPTCHA failed, please try again',
        //         statusCode: 400,
        //         code: 'RECAPTCHA_FAILED',
        //     });
        // }

        if (!registerToken) {
            throw new AppError({
                message: 'Session expired, Please try registering again',
                statusCode: 400,
                code: 'SESSION_EXPIRED',
            });
        }

        if (!password || !confirmPassword) {
            throw new AppError({
                message: 'All fields are required',
                statusCode: 400,
                code: 'VALIDATION_ERROR',
            });
        }

        const tokenPayload = await verifyJWTToken(
            registerToken,
            process.env.JWT_REGISTER_EMAIL_SECRET,
            'Token expired, Please try registering again',
        );

        const { email, firstName, lastName } = tokenPayload.data;

        if (password !== confirmPassword) {
            throw new AppError({
                message: 'Passwords do not match',
                statusCode: 400,
                code: 'PASSWORD_MISMATCH',
            });
        }

        if (!validator.isStrongPassword(password)) {
            throw new AppError({
                message:
                    'Password must be 8 characters long, contain atleast one number, lowercase, uppercase letters and a symbol',
                statusCode: 400,
                code: 'WEAK_PASSWORD',
            });
        }

        const filteredBody = filterObj(
            { email, firstName, lastName, password },
            'email',
            'firstName',
            'lastName',
            'password',
        );

        const existing_user = await UserModel.findOne({ email: email });

        if (existing_user) {
            throw new AppError({
                message: 'Email is already registered. Please Login.',
                statusCode: 409,
                code: 'EMAIL_ALREADY_REGISTERED',
            });
        }

        const new_user = await UserModel.create(filteredBody);

        const resp = await sendOtpService(new_user);

        res.cookie('verifyToken', resp.token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 5 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: 'OTP sent.',
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError({
                message: error.message || 'Registration failed, Please try again.',
                statusCode: 500,
                code: 'REGISTRATION_FAILED',
            });
        }
    }
});

export const refreshToken = catchAsync(async (req, res) => {
    try {
        const refresh_token = req.cookies.refreshToken;

        if (!refresh_token) {
            throw new AppError({
                message: 'Please login',
                statusCode: 401,
                code: 'REFRESH_TOKEN_NOT_FOUND',
            });
        }

        const check = await verifyJWTToken(
            refresh_token,
            process.env.JWT_REFRESH_SECRET,
            'Token expired, Please try again',
        );

        const user = await UserModel.findOne({ _id: check.userId, verified: true });

        if (!user) {
            throw new AppError({
                message: 'User not verified/does not exist',
                statusCode: 404,
                code: 'USER_NOT_FOUND',
            });
        }

        const access_token = await generateJWTToken(
            { userId: user._id },
            '1d',
            process.env.JWT_ACCESS_SECRET,
        );

        return res.status(200).json({
            status: 'success',
            message: 'Token Refreshed',
            data: {
                user: {
                    token: access_token,
                },
            },
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError({
                message: error.message || 'Token refresh failed, Please try again.',
                statusCode: 500,
                code: 'TOKEN_REFRESH_FAILED',
            });
        }
    }
});

export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email, recaptchaToken } = req.body;

    if (!email) {
        throw new AppError({
            message: 'Email is required',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }

    const filteredBody = filterObj({ email }, 'email');

    const user = await UserModel.findOne({ email: filteredBody.email });

    if (!user) {
        return res.status(200).json({
            success: true,
            message: 'If an account with that email exists, a reset link has been sent.',
        });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');

    await redis.set(
        `reset:${resetToken}`,
        JSON.stringify({
            userId: user._id,
            email: user.email,
        }),
        { ex: 15 * 60 },
    );

    const resetURL = isProduction
        ? `${process.env.FRONTEND_URL}/auth/reset-password/${resetToken}`
        : `http://localhost:5173/auth/reset-password/${resetToken}`;

    try {
        const emailDetails = {
            from: `Convia Chat<${process.env.SMTP_EMAIL}>`,
            to: user.email,
            subject: 'Convia Chat - Password Reset Request',
            html: resetPasswordTemplate({
                name: user.firstName,
                link: resetURL,
                email: process.env.SMTP_EMAIL,
            }),
        };

        await transporter.sendMail(emailDetails);

        return res.status(200).json({
            success: true,
            message: 'Reset link sent to email.',
        });
    } catch (err) {
        await redis.del(`reset:${resetToken}`);
        throw new AppError({
            message: err.message || 'There was an error sending the email. Try again later.',
            statusCode: err.statusCode || 500,
            code: err.code || 'FORGOT_PASSWORD_FAILED',
        });
    }
});

export const resetPassword = catchAsync(async (req, res, next) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            throw new AppError({
                message: 'All fields (token, password, confirmPassword) are required',
                statusCode: 400,
                code: 'VALIDATION_ERROR',
            });
        }

        if (password !== confirmPassword) {
            throw new AppError({
                message: 'Passwords do not match',
                statusCode: 400,
                code: 'PASSWORD_MISMATCH',
            });
        }

        if (!validator.isStrongPassword(password)) {
            throw new AppError({
                message:
                    'Password must be 8 characters long, contain at least one number, lowercase, uppercase letters and a symbol',
                statusCode: 400,
                code: 'WEAK_PASSWORD',
            });
        }

        const data = await redis.get(`reset:${token}`);

        if (!data) {
            throw new AppError({
                message: 'Session expired, Please try resetting your password again.',
                statusCode: 400,
                code: 'SESSION_EXPIRED',
            });
        }

        const user = await UserModel.findById(data.userId);

        if (!user) {
            throw new AppError({
                message: 'User not found, Please try resetting your password again.',
                statusCode: 404,
                code: 'USER_NOT_FOUND',
            });
        }

        user.password = password;
        await user.save();

        await redis.del(`reset:${token}`);

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully. You can now login.',
        });
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        } else {
            throw new AppError({
                message: error.message || 'Reset password failed, Please try again.',
                statusCode: 500,
                code: 'RESET_PASSWORD_FAILED',
            });
        }
    }
});
