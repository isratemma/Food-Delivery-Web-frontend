import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineArrowLeft, HiOutlineCheckCircle } from 'react-icons/hi2';
import { forgotPasswordApi } from '../api/auth.api';

const ForgotPassword = () => {
  const [email, setEmail]     = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    try {
      setLoading(true);
      await forgotPasswordApi({ email: email.trim().toLowerCase() });
      setSent(true);
    } catch {
      // Always show success to not leak whether email exists
      setSent(true);
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
          <h1 className="text-xl font-semibold text-[#0F172A]">Forgot your password?</h1>
          <p className="text-sm text-[#64748B] mt-1 text-center">
            Enter your email and we'll send a reset link
          </p>
        </div>

        {/* Sent state */}
        {sent ? (
          <div className="flex flex-col items-center text-center gap-3 py-4">
            <HiOutlineCheckCircle size={40} className="text-[#5b3256]" />
            <p className="text-sm font-medium text-[#0F172A]">Check your inbox</p>
            <p className="text-sm text-[#64748B]">
              If <span className="font-medium text-[#0F172A]">{email}</span> is registered,
              you'll receive a reset link shortly.
            </p>
            <p className="text-xs text-[#94A3B8] mt-1">Didn't get it? Check your spam folder.</p>
            <button
              type="button"
              onClick={() => { setSent(false); setEmail(''); }}
              className="mt-2 text-sm text-[#5b3256] font-medium hover:underline"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <HiOutlineEnvelope
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className={`w-full border rounded-lg pl-9 pr-3 py-2.5 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none transition-colors
                    ${error ? 'border-red-400' : 'border-[#DCDCDC] focus:border-[#5b3256]'}`}
                />
              </div>
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        {/* Back to sign in */}
        <Link
          to="/signin"
          className="flex items-center justify-center gap-1.5 text-sm text-[#64748B] hover:text-[#5b3256] transition-colors mt-6"
        >
          <HiOutlineArrowLeft size={14} />
          Back to sign in
        </Link>

      </div>
    </div>
  );
};

export default ForgotPassword;
