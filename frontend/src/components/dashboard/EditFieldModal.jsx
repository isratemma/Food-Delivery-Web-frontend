import React, { useState } from 'react';
import { HiOutlineXMark } from 'react-icons/hi2';

const EditFieldModal = ({ label, value, type = 'text', onSave, onClose }) => {
  const [val, setVal] = useState(value || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(val);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="relative bg-white rounded-2xl border border-[#EDE8F0] shadow-xl p-6 max-w-sm w-full"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#F8F5FC] flex items-center justify-center text-[#64748B] hover:text-[#5b3256]">
          <HiOutlineXMark size={16} />
        </button>
        <h3 className="text-sm font-bold text-[#0F172A] mb-4">Edit {label}</h3>
        <input
          type={type}
          value={val}
          onChange={e => setVal(e.target.value)}
          autoFocus
          className="w-full bg-[#FDFAFF] border border-[#EDE8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#5b3256] focus:ring-2 focus:ring-[#5b3256]/10 transition-all mb-4"
        />
        <div className="flex gap-2">
          <button onClick={onClose}
            className="flex-1 border border-[#EDE8F0] text-sm font-medium py-2.5 rounded-xl hover:bg-[#F8F5FC] transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFieldModal;
