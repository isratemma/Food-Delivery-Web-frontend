import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

/* ── protect ─────────────────────────────────────────────────
   Verifies the JWT from the httpOnly cookie.
   Attaches the user object to req.user for downstream handlers.
   Usage: router.get('/profile', protect, getProfile)
──────────────────────────────────────────────────────────── */
const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please sign in.' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session expired. Please sign in again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token. Please sign in again.' });
    }
    console.error('protect middleware error:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

export default protect;
