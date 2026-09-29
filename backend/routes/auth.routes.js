import express from 'express';
import { signUp, signIn, signOut, googleSignIn } from '../controllers/auth.controller.js';
import protect from '../middlewares/protect.js';

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/signout', signOut);
router.post('/google', googleSignIn);

// Protected — returns current logged-in user
router.get('/me', protect, (req, res) => {
  res.status(200).json(req.user);
});

export default router;
