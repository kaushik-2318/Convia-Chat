import UserModel from '../models/userModel.js';
import { catchAsync } from '../utils/catchAsync.js';
import { isDisposableEmail } from '../utils/checkDispose.js';
import { filterObj } from '../utils/filterObj.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { verifyreCAPTCHA } from '../services/authService.js';

export const login = catchAsync(async (req, res, next) => {
    const { email, password, recaptchaToken } = req.body;

    if (!email || !password) {
        throw new AppError({
            message: 'Email and Password are required',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }

    const reCAPTCHA = await verifyreCAPTCHA(recaptchaToken);

    if (!reCAPTCHA.success) {
        throw new AppError({
            message: 'reCAPTCHA failed, please try again',
            statusCode: 400,
            code: 'RECAPTCHA_FAILED',
        });
    }

    const user = await UserModel.findOne({ email: email }).select('+password');

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
        throw new AppError({
            message: `Hello ${user.firstName}, please verify your account`,
            statusCode: 403,
            code: 'EMAIL_NOT_VERIFIED',
        });
    }

    const access_token = await generateLoginTokens(user, res);

    return res.status(200).json({
        status: 'success',
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
            },
        },
    });
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

    if (existing_user && existing_user.verified) {
        throw new AppError({
            message: 'Email is already registered',
            statusCode: 409,
            code: 'EMAIL_ALREADY_REGISTERED',
        });
    }

    const token = jwt.sign(
        { data: { email, firstName, lastName }, purpose: 'REGISTER' },
        process.env.JWT_SECRET,
        {
            expiresIn: '5m',
        },
    );

    return res.status(200).json({
        status: 'success',
        message: 'Email is available for registration',
        data: {
            token,
        },
    });
});

export const register = catchAsync(async (req, res, next) => {
    const { token, password, confirmPassword, recaptchaToken } = req.body;

    if (!token || !password || !confirmPassword) {
        throw new AppError({
            message: 'All fields are required',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }

    if (!recaptchaToken) {
        throw new AppError({
            message: 'reCAPTCHA token is required',
            statusCode: 400,
            code: 'VALIDATION_ERROR',
        });
    }

    const reCAPTCHA = await verifyreCAPTCHA(recaptchaToken);

    if (!reCAPTCHA.success) {
        throw new AppError({
            message: 'reCAPTCHA failed, please try again',
            statusCode: 400,
            code: 'RECAPTCHA_FAILED',
        });
    }

    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

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
        {
            email,
            firstName,
            lastName,
            password,
        },
        'email',
        'firstName',
        'lastName',
        'password',
    );

    const existing_user = await UserModel.findOne({ email: email });

    if (existing_user && !existing_user.verified) {
        existing_user.set(filteredBody);
        await existing_user.save();
        req.userId = existing_user._id;
        next();
    } else {
        const new_user = await UserModel.create(filteredBody);
        req.userId = new_user.id;
        next();
    }
});
