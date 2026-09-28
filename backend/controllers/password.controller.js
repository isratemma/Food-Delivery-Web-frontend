import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';

/* helper — 6-digit OTP */
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ── Send OTP ────────────────────────────────────────────────
   POST /api/auth/forgot-password
   Body: { email }
──────────────────────────────────────────────────────────── */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Always 200 — don't reveal if email exists
    if (!user) {
      return res.status(200).json({ message: 'If that email is registered, an OTP has been sent.' });
    }

    const otp = generateOTP();

    // Store plain OTP + 10-min expiry (short window for OTP)
    user.resetToken = otp;
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    console.log(`\n🔑 OTP for ${user.email}: ${otp}\n`); // always log for dev

    // If email not configured, skip sending but still succeed
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_gmail@gmail.com') {
      console.warn('⚠️  Email not configured — OTP printed above for testing');
      return res.status(200).json({ message: 'OTP sent to your email.' });
    }

    try {
      await sendEmail({
        to: user.email,
        subject: 'Your VingoLink password reset OTP',
        html: `
          <div style="font-family:sans-serif;max-width:420px;margin:auto;padding:32px;">
            <h2 style="color:#5b3256;margin-bottom:4px;">Password Reset OTP</h2>
            <p style="color:#64748b;margin-bottom:24px;">
              Hi ${user.fullName}, use the code below to reset your password.
              It expires in <strong>10 minutes</strong>.
            </p>
            <div style="background:#f5eef4;border:1.5px solid #d8b4d4;border-radius:12px;
                        padding:24px;text-align:center;margin-bottom:24px;">
              <p style="font-size:36px;font-weight:700;letter-spacing:10px;
                        color:#5b3256;margin:0;">${otp}</p>
            </div>
            <p style="color:#94a3b8;font-size:12px;">
              If you didn't request this, ignore this email. Your password won't change.
            </p>
          </div>
        `,
      });
    } catch (mailError) {
      console.error('Email send failed:', mailError.message);
      // Still return success — OTP is saved, user can check terminal in dev
    }

    return res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('forgotPassword error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ── Verify OTP ──────────────────────────────────────────────
   POST /api/auth/verify-otp
   Body: { email, otp }
   Returns a short-lived verified flag so the reset step knows OTP passed.
──────────────────────────────────────────────────────────── */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetToken: otp.trim(),
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Mark OTP as verified by extending expiry another 10 min for the reset step
    user.resetTokenExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    return res.status(200).json({ message: 'OTP verified.' });
  } catch (error) {
    console.error('verifyOTP error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
};

/* ── Reset Password ──────────────────────────────────────────
   POST /api/auth/reset-password
   Body: { email, otp, password }
──────────────────────────────────────────────────────────── */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      resetToken: otp.trim(),
      resetTokenExpiry: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired OTP. Please start over.' });
    }

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
