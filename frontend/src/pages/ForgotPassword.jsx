import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineArrowLeft,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { forgotPasswordApi, verifyOTPApi, resetPasswordApi } from '../api/auth.api';

const pwdStrength = (p) => {
  if (!p) return null;
  let s = 0;
  if (p.length >= 6) s++;
  if (p.length >= 10) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  if (s <= 1) return { label: 'Weak',   color: '#EF4444', w: 'w-1/4' };
  if (s <= 2) return { label: 'Fair',   color: '#F59E0B', w: 'w-2/4' };
  if (s <= 3) return { label: 'Good',   color: '#3B82F6', w: 'w-3/4' };
  return       { label: 'Strong', color: '#22C55E', w: 'w-full' };
};

// ── Step indicators ─────────────────────────────────────────
const steps = ['Email', 'OTP', 'New Password'];

const StepBar = ({ current }) => (
  <div className="flex items-center justify-center gap-2 mb-7">
    {steps.map((label, i) => {
      const done    = i < current;
      const active  = i === current;
      return (
        <React.Fragment key={label}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                ${done   ? 'bg-[#5b3256] text-white'
                : active ? 'bg-[#5b3256] text-white'
                :          'bg-[#E4E4E4] text-[#94A3B8]'}`}
            >
              {done ? <HiOutlineCheckCircle size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-medium ${active ? 'text-[#5b3256]' : 'text-[#94A3B8]'}`}>
              {label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-px w-8 mb-4 transition-colors ${i < current ? 'bg-[#5b3256]' : 'bg-[#E4E4E4]'}`} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

// ── OTP input boxes ──────────────────────────────────────────
const OTPInput = ({ value, onChange }) => {
  const refs = useRef([]);
  const digits = value.split('');

  const handleKey = (e, idx) => {
    if (e.key === 'Backspace') {
      const next = [...digits];
      if (next[idx]) {
        next[idx] = '';
        onChange(next.join(''));
      } else if (idx > 0) {
        refs.current[idx - 1]?.focus();
      }
      return;
    }
    if (!/^\d$/.test(e.key)) return;
    const next = [...digits];
    next[idx] = e.key;
    onChange(next.join(''));
    if (idx < 5) refs.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    const focusIdx = Math.min(pasted.length, 5);
    refs.current[focusIdx]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center">
      {[0,1,2,3,4,5].map((i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onChange={() => {}}
          onKeyDown={(e) => handleKey(e, i)}
          onPaste={handlePaste}
          className="w-11 h-12 text-center text-lg font-bold border-2 rounded-xl bg-white outline-none transition-all
            border-[#DCDCDC] focus:border-[#5b3256] text-[#0F172A] caret-[#5b3256]"
        />
      ))}
    </div>
  );
};

// ── Main component ───────────────────────────────────────────
const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep]       = useState(0); // 0=email, 1=otp, 2=password, 3=done
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm]   = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [showCfm, setShowCfm]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const strength = pwdStrength(password);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Step 0: send OTP ──
  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email'); return; }
    try {
      setLoading(true); setError('');
      await forgotPasswordApi({ email: email.trim().toLowerCase() });
      setStep(1);
      setResendTimer(60);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  // ── Step 1: verify OTP ──
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Enter the 6-digit OTP'); return; }
    try {
      setLoading(true); setError('');
      await verifyOTPApi({ email: email.trim().toLowerCase(), otp });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP');
      setOtp('');
    } finally { setLoading(false); }
  };

  // ── Step 2: reset password ──
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!password) { setError('Password is required'); return; }
    if (password.length < 6) { setError('At least 6 characters'); return; }
    if (password !== confirm) { setError('Passwords do not match'); return; }
    try {
      setLoading(true); setError('');
      await resetPasswordApi({ email: email.trim().toLowerCase(), otp, password });
      setStep(3);
      setTimeout(() => navigate('/signin'), 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    try {
      setLoading(true); setError(''); setOtp('');
      await forgotPasswordApi({ email: email.trim().toLowerCase() });
      setResendTimer(60);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const inputCls = (hasErr) =>
    `w-full border rounded-lg px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none transition-colors
     ${hasErr ? 'border-red-400' : 'border-[#DCDCDC] focus:border-[#5b3256]'}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4">
      <div className="w-full max-w-sm bg-[#F7F7F7] border border-[#E4E4E4] rounded-2xl px-8 py-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#5b3256] mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 21H21M3 18H21M6 18V9M10 18V9M14 18V9M18 18V9M2 9L12 3L22 9"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#0F172A]">Forgot password</h1>
        </div>

        {/* Step bar (not shown on success) */}
        {step < 3 && <StepBar current={step} />}

        {/* ── Step 0: Email ── */}
        {step === 0 && (
          <form onSubmit={handleSendOTP} noValidate className="space-y-4">
            <p className="text-sm text-[#64748B] text-center -mt-2 mb-2">
              We'll send a 6-digit OTP to your email
            </p>
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email address</label>
              <input
                type="email" autoComplete="email" placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className={inputCls(error)}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Sending OTP…' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* ── Step 1: OTP ── */}
        {step === 1 && (
          <form onSubmit={handleVerifyOTP} noValidate className="space-y-5">
            <p className="text-sm text-[#64748B] text-center -mt-2">
              Enter the 6-digit OTP sent to{' '}
              <span className="font-medium text-[#0F172A]">{email}</span>
            </p>

            <OTPInput value={otp} onChange={(v) => { setOtp(v); setError(''); }} />

            {error && <p className="text-xs text-red-500 text-center">{error}</p>}

            <button type="submit" disabled={loading || otp.length < 6}
              className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>

            {/* Resend */}
            <p className="text-center text-xs text-[#94A3B8]">
              Didn't receive it?{' '}
              <button
                type="button" onClick={handleResend}
                disabled={resendTimer > 0 || loading}
                className="text-[#5b3256] font-medium hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </p>
          </form>
        )}

        {/* ── Step 2: New password ── */}
        {step === 2 && (
          <form onSubmit={handleResetPassword} noValidate className="space-y-4">
            <p className="text-sm text-[#64748B] text-center -mt-2 mb-1">
              Choose a new password
            </p>

            {error && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                {error}
              </p>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">New password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="••••••••" value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className={inputCls(false) + ' pr-10'}
                />
                <button type="button" onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#5b3256] transition-colors">
                  {showPwd ? <HiOutlineEyeSlash size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
              {strength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.w}`}
                      style={{ backgroundColor: strength.color }} />
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Confirm password</label>
              <div className="relative">
                <input
                  type={showCfm ? 'text' : 'password'} autoComplete="new-password"
                  placeholder="••••••••" value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                  className={inputCls(false) + ' pr-10'}
                />
                <button type="button" onClick={() => setShowCfm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#5b3256] transition-colors">
                  {showCfm ? <HiOutlineEyeSlash size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1">
              {loading ? 'Updating…' : 'Reset password'}
            </button>
          </form>
        )}

        {/* ── Step 3: Success ── */}
        {step === 3 && (
          <div className="flex flex-col items-center text-center gap-3 py-2">
            <HiOutlineCheckCircle size={44} className="text-[#5b3256]" />
            <p className="text-base font-semibold text-[#0F172A]">Password updated!</p>
            <p className="text-sm text-[#64748B]">Redirecting you to sign in…</p>
          </div>
        )}

        {/* Back link */}
        {step < 3 && (
          <div className="mt-6 flex items-center justify-center gap-3 text-xs text-[#94A3B8]">
            {step > 0 && (
              <button type="button"
                onClick={() => { setStep((s) => s - 1); setError(''); }}
                className="flex items-center gap-1 hover:text-[#5b3256] transition-colors">
                <HiOutlineArrowLeft size={12} /> Back
              </button>
            )}
            {step > 0 && <span>·</span>}
            <Link to="/signin" className="hover:text-[#5b3256] transition-colors">
              Sign in
            </Link>
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
