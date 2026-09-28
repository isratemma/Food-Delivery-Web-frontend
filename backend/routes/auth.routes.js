import express from 'express';
import { signUp, signIn, signOut } from '../controllers/auth.controller.js';
import {
  forgotPassword,
  resetPassword,
  verifyResetToken,
} from '../controllers/password.controller.js';

const router = express.Router();

// Auth
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);

// Password reset
router.post('/forgot-password', forgotPassword);
router.get('/reset-password/:token/verify', verifyResetToken);
router.post('/reset-password/:token', resetPassword);

export default router;
