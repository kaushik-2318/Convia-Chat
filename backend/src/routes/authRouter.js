import express from 'express';
import trimRequest from 'trim-request';
import {
    login,
    register,
    checkEmail,
    refreshToken,
    verifyOTP,
    resendOTP,
} from '../controllers/authController.js';
// import { githubAuth, googleAuth, linkedinAuth} from "../controllers/socialController.js";

const authRouter = express.Router();

//Email Check
authRouter.route('/check-email').post(trimRequest.all, checkEmail);

// Register Route
authRouter.route('/register').post(trimRequest.all, register);

// Login Route
authRouter.route('/login').post(trimRequest.all, login);

// Verify OTP Route
authRouter.route('/verify-otp').post(trimRequest.all, verifyOTP);

// Resend OTP Route
authRouter.route('/resend-otp').post(trimRequest.all, resendOTP);

// Send OTP Route
// authRouter.route("/send-otp").post(trimRequest.all, sendOtp);

// Refresh Token Route
authRouter.route('/refresh-token').post(trimRequest.all, refreshToken);

// // Logout Route
// authRouter.route("/logout").post(trimRequest.all, logout);

// // Forgot Password Route
// authRouter.route("/forgot-password").post(trimRequest.all, forgotPassword);

// // Reset Password Route
// authRouter.route("/reset-password").post(trimRequest.all, resetPassword);

// // ------------- Social Auth -------------

// // Google Auth Route
// authRouter.route("/google").post(googleAuth);

// // GitHub Auth Route
// authRouter.route("/github").post(githubAuth);

// // LinkedIn Auth Route
// authRouter.route("/linkedin").post(linkedinAuth);

export default authRouter;
