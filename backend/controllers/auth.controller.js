import bcrypt from 'bcryptjs';
import genToken from '../utils/token.js';
import User from '../models/user.model.js';

export const signUp = async (req, res) => {
  try {
    const { fullName, email, password, mobile, role } = req.body;

    // Basic presence check
    if (!fullName || !email || !password || !mobile || !role) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check duplicate
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    // Password length
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Mobile length — strip non-digits before checking
    const digitsOnly = mobile.replace(/\D/g, '');
    if (digitsOnly.length < 11) {
      return res.status(400).json({ message: 'Mobile number must be at least 11 digits.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      role,
      mobile,
      password: hashedPassword,
    });

    const token = await genToken(newUser._id);

    res.cookie('token', token, {
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const { password: _pw, ...userWithoutPassword } = newUser.toObject();
    return res.status(201).json(userWithoutPassword);

  } catch (error) {
    console.error('signUp error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

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
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    const { password: _pw, ...userWithoutPassword } = user.toObject();
    return res.status(200).json(userWithoutPassword);

  } catch (error) {
    console.error('signIn error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

export const signOut = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('signOut error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
