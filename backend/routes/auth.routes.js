import express from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controller.js';
import {
  forgotPassword,
  verifyOTP,
  resetPassword,
} from '../controllers/password.controller.js';

const router = express.Router();

// Auth
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

// OTP-based password reset
router.post('/forgot-password', forgotPassword); // step 1 — send OTP
router.post('/verify-otp', verifyOTP);           // step 2 — verify OTP
router.post('/reset-password', resetPassword);   // step 3 — set new password

export default router;
