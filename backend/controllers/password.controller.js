import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';

/* ── Forgot Password ─────────────────────────────────────────
   POST /api/auth/forgot-password
   Body: { email }
   Generates a 1-hour reset token, stores hashed version in DB,
   emails a reset link to the user.
──────────────────────────────────────────────────────────── */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Always return 200 — never reveal if email exists (security)
    if (!user) {
      return res.status(200).json({
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    // Generate raw token and hash it for storage
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Reset your VingoLink password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:auto;padding:32px;">
          <h2 style="color:#5b3256;margin-bottom:8px;">Reset your password</h2>
          <p style="color:#64748b;margin-bottom:24px;">
            Hi ${user.fullName}, click the button below to reset your password.
            This link expires in <strong>1 hour</strong>.
          </p>
          <a href="${resetURL}"
            style="display:inline-block;background:#5b3256;color:#fff;text-decoration:none;
                   padding:12px 28px;border-radius:8px;font-weight:600;font-size:14px;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">
            If you didn't request this, you can safely ignore this email.
          </p>
          <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;" />
          <p style="color:#94a3b8;font-size:12px;">
            Or copy this link: <a href="${resetURL}" style="color:#5b3256;">${resetURL}</a>
          </p>
        </div>
      `,
    });

    return res.status(200).json({
      message: 'If that email exists, a reset link has been sent.',
    });
  } catch (error) {
    console.error('forgotPassword error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ── Reset Password ──────────────────────────────────────────
   POST /api/auth/reset-password/:token
   Body: { password }
   Verifies token, checks expiry, updates password.
──────────────────────────────────────────────────────────── */
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Hash the incoming token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() }, // not expired
    });

    if (!user) {
      return res.status(400).json({
        message: 'Reset link is invalid or has expired. Please request a new one.',
      });
    }

    // Update password and clear token
    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully. You can now sign in.' });
  } catch (error) {
    console.error('resetPassword error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ── Verify Token (optional — frontend can call to pre-validate) ──
   GET /api/auth/reset-password/:token/verify
──────────────────────────────────────────────────────────── */
export const verifyResetToken = async (req, res) => {
  try {
    const { token } = req.params;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetToken: hashedToken,
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ valid: false, message: 'Invalid or expired link.' });
    }

    return res.status(200).json({ valid: true });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.' });
  }
};
