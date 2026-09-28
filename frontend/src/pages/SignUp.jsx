import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import AuthLayout from '../components/layouts/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Alert from '../components/ui/Alert';
import { signUpApi } from '../api/auth.api';

const ROLE_OPTIONS = [
  { value: 'user', label: 'User — Browse & book services' },
  { value: 'owner', label: 'Owner — Manage a business or firm' },
  { value: 'deliveryBoy', label: 'Delivery — Field / delivery staff' },
];

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pwd.length >= 6) score++;
  if (pwd.length >= 10) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;

  if (score <= 1) return { score, label: 'Weak', color: '#EF4444' };
  if (score <= 2) return { score, label: 'Fair', color: '#F59E0B' };
  if (score <= 3) return { score, label: 'Good', color: '#3B82F6' };
  return { score, label: 'Strong', color: '#22C55E' };
};

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState(false);

  const strength = passwordStrength(form.password);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const e = {};

    if (!form.fullName.trim()) e.fullName = 'Full name is required.';
    else if (form.fullName.trim().length < 3)
      e.fullName = 'Name must be at least 3 characters.';

    if (!form.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = 'Enter a valid email address.';

    if (!form.mobile.trim()) e.mobile = 'Mobile number is required.';
    else if (form.mobile.replace(/\D/g, '').length < 11)
      e.mobile = 'Mobile number must be at least 11 digits.';

    if (!form.role) e.role = 'Please select a role.';

    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 6)
      e.password = 'Password must be at least 6 characters.';

    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match.';

    return e;
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
      await signUpApi({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        password: form.password,
        role: form.role,
      });
      setSuccess(true);
      setTimeout(() => navigate('/signin'), 1800);
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
      <div className="mb-7 space-y-1.5">
        <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: '#0F172A' }}>
          Create your account
        </h2>
        <p className="text-sm" style={{ color: '#64748B' }}>
          Join VingoLink and start building together
        </p>
      </div>

      {/* Success state */}
      {success && (
        <div className="mb-5">
          <Alert
            type="success"
            message="Account created! Redirecting you to sign in…"
          />
        </div>
      )}

      {/* API error */}
      {apiError && (
        <div className="mb-5">
          <Alert type="error" message={apiError} />
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Full Name */}
        <Input
          label="Full name"
          id="fullName"
          type="text"
          placeholder="John Adler"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
          icon={HiOutlineUser}
          required
          autoComplete="name"
        />

        {/* Email */}
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

        {/* Mobile */}
        <Input
          label="Mobile number"
          id="mobile"
          type="tel"
          placeholder="01xxxxxxxxx"
          value={form.mobile}
          onChange={handleChange}
          error={errors.mobile}
          icon={HiOutlinePhone}
          required
          autoComplete="tel"
        />

        {/* Role */}
        <Select
          label="I am a…"
          id="role"
          value={form.role}
          onChange={handleChange}
          options={ROLE_OPTIONS}
          placeholder="Select your role"
          error={errors.role}
          required
        />

        {/* Password */}
        <div className="space-y-2">
          <Input
            label="Password"
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            icon={HiOutlineLockClosed}
            required
            autoComplete="new-password"
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

          {/* Strength bar */}
          {form.password && (
            <div className="space-y-1">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="h-1 flex-1 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor:
                        i <= strength.score ? strength.color : '#E2E8F0',
                    }}
                  />
                ))}
              </div>
              <p className="text-xs" style={{ color: strength.color }}>
                {strength.label} password
              </p>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <Input
          label="Confirm password"
          id="confirmPassword"
          type={showConfirm ? 'text' : 'password'}
          placeholder="Repeat your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          icon={
            form.confirmPassword && form.password === form.confirmPassword
              ? HiOutlineCheckCircle
              : HiOutlineLockClosed
          }
          required
          autoComplete="new-password"
          rightElement={
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-[#64748B] hover:text-[#4F46E5] transition-colors focus:outline-none"
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
            >
              {showConfirm ? (
                <HiOutlineEyeSlash size={18} />
              ) : (
                <HiOutlineEye size={18} />
              )}
            </button>
          }
        />

        {/* Terms note */}
        <p className="text-xs leading-relaxed" style={{ color: '#94A3B8' }}>
          By creating an account you agree to our{' '}
          <Link
            to="/terms"
            className="underline hover:text-[#4F46E5] transition-colors"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            to="/privacy"
            className="underline hover:text-[#4F46E5] transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <Button type="submit" fullWidth loading={loading} disabled={success}>
          {loading ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>

      {/* Sign in link */}
      <p className="text-center text-sm mt-6" style={{ color: '#64748B' }}>
        Already have an account?{' '}
        <Link
          to="/signin"
          className="font-semibold transition-colors hover:underline"
          style={{ color: '#4F46E5' }}
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default SignUp;
