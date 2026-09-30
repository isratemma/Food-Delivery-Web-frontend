import React from 'react';
import { HiOutlineXMark, HiOutlineRocketLaunch } from 'react-icons/hi2';

const ComingSoon = ({ feature, onClose }) => {
  if (!feature) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl border border-[#EDE8F0] shadow-xl p-8 max-w-sm w-full text-center"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#F8F5FC] flex items-center justify-center text-[#64748B] hover:text-[#5b3256] transition-colors">
          <HiOutlineXMark size={16} />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-[#f5eef4] flex items-center justify-center mx-auto mb-4">
          <HiOutlineRocketLaunch size={26} className="text-[#5b3256]" />
        </div>
        <h3 className="text-base font-bold text-[#0F172A] mb-1">{feature}</h3>
        <p className="text-sm text-[#94A3B8] mb-5">This feature is coming soon. We&apos;re working hard to bring it to you.</p>
        <button onClick={onClose}
          className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors">
          Got it
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
