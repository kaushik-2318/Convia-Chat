import otpGenerator from 'otp-generator';

export const generateOtp = () =>
    otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false });
