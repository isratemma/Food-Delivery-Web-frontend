import React from 'react';
import { HiCheckCircle, HiXCircle, HiInformationCircle } from 'react-icons/hi2';

const icons = {
  success: HiCheckCircle,
  error: HiXCircle,
  info: HiInformationCircle,
};

const styles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-700',
  info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
};

const iconColors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-indigo-500',
};

const Alert = ({ type = 'info', message }) => {
  if (!message) return null;
  const Icon = icons[type];

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${styles[type]}`}
    >
      <Icon className={`mt-0.5 shrink-0 text-lg ${iconColors[type]}`} />
      <p>{message}</p>
    </div>
  );
};

export default Alert;
