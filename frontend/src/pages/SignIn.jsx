import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeSlash } from 'react-icons/hi2';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { signInApi } from '../api/auth.api';

const SignIn = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Enter a valid email address.';
    }
    if (!form.password) {
      newErrors.password = 'Password is required.';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await signInApi({ email: form.email.trim(), password: form.password });
      navigate('/dashboard');
    } catch (err) {
      const message =
        err.response?.data?.message ||
        'Something went wrong. Please try again.';
      setApiError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div className="mb-8 space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0F172A' }}>
          Welcome back
        </h2>
        <p className="text-sm" style={{ color: '#64748B' }}>
          Sign in to your VingoLink account
        </p>
      </div>

      {/* API error */}
      {apiError && <div className="mb-5"><Alert type="error" message={apiError} /></div>}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Input
          label="Email address"
          id="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          icon={HiOutlineEnvelope}
          required
          autoComplete="email"
        />

        <Input
          label="Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
          icon={HiOutlineLockClosed}
          required
          autoComplete="current-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-[#64748B] hover:text-[#4F46E5] transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <HiOutlineEyeSlash size={18} />
              ) : (
                <HiOutlineEye size={18} />
              )}
            </button>
          }
        />

        {/* Forgot password link */}
        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-sm font-medium transition-colors"
            style={{ color: '#4F46E5' }}
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
        <span className="text-xs" style={{ color: '#94A3B8' }}>
          or
        </span>
        <div className="flex-1 h-px" style={{ backgroundColor: '#E2E8F0' }} />
      </div>

      {/* Sign up link */}
      <p className="text-center text-sm" style={{ color: '#64748B' }}>
        Don&apos;t have an account?{' '}
        <Link
          to="/signup"
          className="font-semibold transition-colors hover:underline"
          style={{ color: '#4F46E5' }}
        >
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignIn;
