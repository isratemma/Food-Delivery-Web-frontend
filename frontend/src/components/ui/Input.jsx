import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  icon: Icon,
  rightElement,
  required,
  autoComplete,
}) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium"
          style={{ color: '#0F172A' }}
        >
          {label}
          {required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 pointer-events-none">
            <Icon size={17} style={{ color: '#64748B' }} />
          </div>
        )}

        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          className={`
            w-full rounded-xl px-4 py-3 text-sm outline-none transition-all duration-200
            border bg-white placeholder-[#94A3B8]
            focus:ring-2 focus:ring-[#4F46E5]/20 focus:border-[#4F46E5]
            ${Icon ? 'pl-10' : ''}
            ${rightElement ? 'pr-12' : ''}
            ${error
              ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
              : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
            }
          `}
          style={{ color: '#0F172A', backgroundColor: '#FFFFFF' }}
        />

        {rightElement && (
          <div className="absolute right-3">{rightElement}</div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-0.5">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
};

export default Input;
