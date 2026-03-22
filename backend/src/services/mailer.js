import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const config = {
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
    },
};

export const transporter = nodemailer.createTransport(config);

export const formatRemainingTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return minutes > 0 ? `${minutes}min ${seconds}s` : `${seconds}s`;
};
