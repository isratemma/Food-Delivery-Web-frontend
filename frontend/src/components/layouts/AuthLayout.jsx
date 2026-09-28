import React from 'react';

/**
 * Shared layout for Sign In / Sign Up.
 * Left panel — branding / decorative. Right panel — form.
 */
const AuthLayout = ({ children }) => {
  return (
    <div
      className="min-h-screen w-full flex"
      style={{ backgroundColor: '#F8FAFC' }}
    >
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 xl:w-[55%] flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background:
            'linear-gradient(135deg, #4F46E5 0%, #7C3AED 60%, #8B5CF6 100%)',
        }}
      >
        {/* Background circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10 bg-white" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-16 left-1/4 w-64 h-64 rounded-full opacity-10 bg-white" />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 21H21M3 18H21M6 18V9M10 18V9M14 18V9M18 18V9M2 9L12 3L22 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              VingoLink
            </span>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <div className="space-y-3">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Design the future,
              <br />
              <span className="text-indigo-200">brick by brick.</span>
            </h1>
            <p className="text-indigo-200 text-lg leading-relaxed max-w-sm">
              Your all-in-one platform for architectural projects, client
              collaboration, and seamless workflows.
            </p>
          </div>

          {/* Stats row */}
          <div className="flex gap-8">
            {[
              { value: '2,400+', label: 'Projects' },
              { value: '840+', label: 'Clients' },
              { value: '98%', label: 'Satisfaction' },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-indigo-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial card */}
        <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <p className="text-white/90 text-sm leading-relaxed italic">
            "VingoLink transformed how our firm manages projects. The clarity
            and control it gives us is unmatched."
          </p>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-8 h-8 rounded-full bg-indigo-300 flex items-center justify-center text-indigo-900 text-xs font-bold">
              JA
            </div>
            <div>
              <p className="text-white text-sm font-medium">James Adler</p>
              <p className="text-indigo-300 text-xs">Lead Architect, Studio 9</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-14">
        <div className="w-full max-w-md">
          {/* Mobile logo (only visible on small screens) */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #4F46E5, #8B5CF6)' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 21H21M3 18H21M6 18V9M10 18V9M14 18V9M18 18V9M2 9L12 3L22 9"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="font-bold text-lg" style={{ color: '#0F172A' }}>
              VingoLink
            </span>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
