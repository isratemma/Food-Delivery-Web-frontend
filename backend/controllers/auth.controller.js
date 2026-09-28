import bcrypt from 'bcryptjs';
import genToken from '../utils/token.js';
import User from '../models/user.model.js';

/* ── Sign Up ─────────────────────────────────────────────── */
export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    if (!fullName || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length < 11) {
      return res.status(400).json({ message: 'Mobile number must be at least 11 digits.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ fullName, email, role, mobile, password: hashedPassword });

    const token = await genToken(newUser._id);
    res.cookie('token', token, {
      secure: false, sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true,
    });

    const { password: _pw, ...user } = newUser.toObject();
    return res.status(201).json(user);
  } catch (error) {
    console.error('signUp error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ── Sign In ─────────────────────────────────────────────── */
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No account found with this email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = await genToken(user._id);
    res.cookie('token', token, {
      secure: false, sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true,
    });

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('signIn error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ── Sign Out ────────────────────────────────────────────── */
export const signOut = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('signOut error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ── Google Sign In ──────────────────────────────────────────
   POST /api/auth/google
   Body: { email, fullName, avatar, googleUid, role? }
   No token verification needed — Firebase already authenticated on frontend.
──────────────────────────────────────────────────────────── */
export const googleSignIn = async (req, res) => {
  try {
    const { email, fullName, avatar, googleUid, role } = req.body;

    if (!email || !googleUid) {
      return res.status(400).json({ message: 'Google account info is required.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // New Google user — role required
      if (!role) {
        return res.status(400).json({
          message: 'Please select a role to complete sign-up.',
          requiresRole: true,
        });
      }

      user = await User.create({
        fullName: fullName || email.split('@')[0],
        email,
        mobile: '00000000000',
        role,
        googleUid,
        avatar: avatar || '',
      });
    }

    const token = await genToken(user._id);
    res.cookie('token', token, {
      secure: false, sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true,
    });

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('googleSignIn error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
