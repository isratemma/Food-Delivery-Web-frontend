import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import { signIn, googleSignIn, clearError, selectAuthLoading, selectAuthError } from '../store/slices/authSlice';
import { auth, googleProvider } from '../lib/firebase';
import { signInWithPopup } from 'firebase/auth';

const GoogleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.85l6.08-6.08C34.46 3.05 29.5 1 24 1 14.82 1 7.07 6.48 3.65 14.27l7.12 5.53C12.47 13.59 17.8 9.5 24 9.5z"/>
    <path fill="#4285F4" d="M46.52 24.5c0-1.64-.15-3.22-.42-4.75H24v9h12.68c-.55 2.94-2.2 5.44-4.68 7.12l7.18 5.58C43.36 37.38 46.52 31.42 46.52 24.5z"/>
    <path fill="#FBBC05" d="M10.77 28.2A14.54 14.54 0 019.5 24c0-1.46.25-2.87.68-4.2l-7.12-5.53A23.93 23.93 0 001 24c0 3.86.93 7.5 2.58 10.72l7.19-6.52z"/>
    <path fill="#34A853" d="M24 47c5.5 0 10.12-1.82 13.49-4.94l-7.18-5.58C28.51 38.25 26.36 39 24 39c-6.2 0-11.47-4.09-13.23-9.8l-7.19 6.52C7.07 43.52 14.82 47 24 47z"/>
  </svg>
);

const SignIn = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const loading   = useSelector(selectAuthLoading);
  const reduxError = useSelector(selectAuthError);

  const [form, setForm]       = useState({ email: '', password: '' });
  const [errors, setErrors]   = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
    dispatch(clearError());
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    const result = await dispatch(signIn({ email: form.email.trim(), password: form.password }));
    if (signIn.fulfilled.match(result)) {
      const role = result.payload?.role;
      navigate(role === 'owner' ? '/dashboard' : '/');
    }
  };

  const handleGoogle = async () => {
    try {
      setGLoading(true);
      dispatch(clearError());
      const result = await signInWithPopup(auth, googleProvider);
      const { email, displayName, photoURL, uid } = result.user;
      const action = await dispatch(googleSignIn({
        email,
        fullName: displayName || email.split('@')[0],
        avatar: photoURL || '',
        googleUid: uid,
      }));
      if (googleSignIn.fulfilled.match(action)) {
        const role = action.payload?.role;
        navigate(role === 'owner' ? '/dashboard' : '/');
      }
    } catch (err) {
      if (err.code === 'auth/popup-closed-by-user') return;
    } finally {
      setGLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F1F1F1] px-4">
      <div className="w-full max-w-sm bg-[#F7F7F7] border border-[#E4E4E4] rounded-2xl px-8 py-10">

        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#5b3256] mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M3 21H21M3 18H21M6 18V9M10 18V9M14 18V9M18 18V9M2 9L12 3L22 9"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#0F172A]">Sign in to VingoLink</h1>
          <p className="text-sm text-[#64748B] mt-1">Welcome back</p>
        </div>

        {/* Google */}
        <button
          type="button" onClick={handleGoogle} disabled={gLoading || loading}
          className="w-full flex items-center justify-center gap-2.5 border border-[#DCDCDC] rounded-lg px-4 py-2.5 text-sm text-[#0F172A] bg-white hover:bg-[#F1F1F1] transition-colors mb-4 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <GoogleIcon />
          {gLoading ? 'Connecting…' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-[#DCDCDC]" />
          <span className="text-xs text-[#94A3B8]">or</span>
          <div className="flex-1 h-px bg-[#DCDCDC]" />
        </div>

        {/* Redux error */}
        {reduxError && (
          <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 mb-4">
            {reduxError}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Email</label>
            <input
              name="email" type="email" autoComplete="email"
              placeholder="you@example.com" value={form.email} onChange={handle}
              className={`w-full border rounded-lg px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none transition-colors
                ${errors.email ? 'border-red-400' : 'border-[#DCDCDC] focus:border-[#5b3256]'}`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Password</label>
            <div className="relative">
              <input
                name="password" type={showPwd ? 'text' : 'password'}
                autoComplete="current-password" placeholder="••••••••"
                value={form.password} onChange={handle}
                className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none transition-colors
                  ${errors.password ? 'border-red-400' : 'border-[#DCDCDC] focus:border-[#5b3256]'}`}
              />
              <button type="button" onClick={() => setShowPwd((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#5b3256] transition-colors">
                {showPwd ? <HiOutlineEyeSlash size={16} /> : <HiOutlineEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium rounded-lg py-2.5 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-1"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748B] mt-6">
          No account?{' '}
          <Link to="/signup" className="text-[#5b3256] font-medium hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
