import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  HiOutlineEye, HiOutlineEyeSlash,
  HiOutlineCheckCircle, HiOutlineArrowLeft,
  HiOutlineXCircle,
} from 'react-icons/hi2';
import { verifyTokenApi, resetPasswordApi } from '../api/auth.api';

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

const ResetPassword = () => {
  const { token } = useParams();
  const navigate  = useNavigate();

  const [status, setStatus]       = useState('verifying'); // verifying | valid | invalid | success
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [errors, setErrors]       = useState({});
  const [showPwd, setShowPwd]     = useState(false);
  const [showCfm, setShowCfm]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState('');

  const strength = pwdStrength(password);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      try {
        await verifyTokenApi(token);
        setStatus('valid');
      } catch {
        setStatus('invalid');
      }
    };
    verify();
  }, [token]);

  const validate = () => {
    const e = {};
    if (!password) e.password = 'Password is required';
    else if (password.length < 6) e.password = 'At least 6 characters';
    if (!confirm) e.confirm = 'Please confirm your password';
    else if (password !== confirm) e.confirm = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    try {
      setLoading(true);
      await resetPasswordApi(token, { password });
      setStatus('success');
      setTimeout(() => navigate('/signin'), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4">
      <div className="w-full max-w-sm bg-[#F7F7F7] border border-[#E4E4E4] rounded-2xl px-8 py-10">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#5b3256] mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 21H21M3 18H21M6 18V9M10 18V9M14 18V9M18 18V9M2 9L12 3L22 9"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#0F172A]">Reset your password</h1>
        </div>

        {/* ── Verifying ── */}
        {status === 'verifying' && (
          <div className="flex flex-col items-center py-6 gap-3">
            <svg className="animate-spin h-7 w-7 text-[#5b3256]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <p className="text-sm text-[#64748B]">Verifying your link…</p>
          </div>
        )}

        {/* ── Invalid / expired ── */}
        {status === 'invalid' && (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <HiOutlineXCircle size={40} className="text-red-400" />
            <p className="text-sm font-medium text-[#0F172A]">Link expired or invalid</p>
            <p className="text-sm text-[#64748B]">
              This reset link has expired or already been used.
            </p>
            <Link
              to="/forgot-password"
              className="mt-2 w-full text-center bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium rounded-lg py-2.5 transition-colors"
            >
              Request a new link
            </Link>
          </div>
        )}

        {/* ── Success ── */}
        {status === 'success' && (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <HiOutlineCheckCircle size={40} className="text-[#5b3256]" />
            <p className="text-sm font-medium text-[#0F172A]">Password updated!</p>
            <p className="text-sm text-[#64748B]">
              Your password has been reset. Redirecting you to sign in…
            </p>
          </div>
        )}

        {/* ── Form ── */}
        {status === 'valid' && (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {apiError && (
              <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5">
                {apiError}
              </p>
            )}

            {/* New password */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                New password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((p) => ({ ...p, password: '' }));
                    if (apiError) setApiError('');
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none transition-colors
                    ${errors.password ? 'border-red-400' : 'border-[#DCDCDC] focus:border-[#5b3256]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#5b3256] transition-colors"
                >
                  {showPwd ? <HiOutlineEyeSlash size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}

              {/* Strength bar */}
              {strength && (
                <div className="mt-2 space-y-1">
                  <div className="h-1 w-full bg-[#E2E8F0] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.w}`}
                      style={{ backgroundColor: strength.color }}
                    />
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Confirm password
              </label>
              <div className="relative">
                <input
                  type={showCfm ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (errors.confirm) setErrors((p) => ({ ...p, confirm: '' }));
                  }}
                  className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none transition-colors
                    ${errors.confirm ? 'border-red-400' : 'border-[#DCDCDC] focus:border-[#5b3256]'}`}
                />
                <button
                  type="button"
                  onClick={() => setShowCfm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#5b3256] transition-colors"
                >
                  {showCfm ? <HiOutlineEyeSlash size={16} /> : <HiOutlineEye size={16} />}
                </button>
              </div>
              {errors.confirm && <p className="text-xs text-red-500 mt-1">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? 'Updating…' : 'Reset password'}
            </button>
          </form>
        )}

        {/* Back to sign in */}
        {status !== 'success' && (
          <Link
            to="/signin"
            className="flex items-center justify-center gap-1.5 text-sm text-[#64748B] hover:text-[#5b3256] transition-colors mt-6"
          >
            <HiOutlineArrowLeft size={14} />
            Back to sign in
          </Link>
        )}

      </div>
    </div>
  );
};

export default ResetPassword;
