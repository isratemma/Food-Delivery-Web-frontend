import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';
import { createItem, updateItem, selectItemLoading, selectItemError, clearItemError } from '../../store/slices/itemSlice';

const FL = ({ children, req }) => (
  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
    {children}{req && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const FI = ({ className = '', ...p }) => (
  <input className={`w-full bg-[#FDFAFF] border border-[#EDE8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#C4B9CC] outline-none focus:border-[#5b3256] focus:ring-2 focus:ring-[#5b3256]/10 transition-all ${className}`} {...p} />
);

const ItemForm = ({ shopId, item, onClose }) => {
  const dispatch = useDispatch();
  const loading  = useSelector(selectItemLoading);
  const apiError = useSelector(selectItemError);

  const [form, setForm] = useState({
    name: '', description: '', category: 'Main',
    price: '', discountPrice: '', preparationTime: 15, isVeg: false,
  });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '', description: item.description || '',
        category: item.category || 'Main', price: item.price ?? '',
        discountPrice: item.discountPrice ?? '', preparationTime: item.preparationTime ?? 15,
        isVeg: item.isVeg ?? false,
      });
      setPreview(item.image || '');
    }
  }, [item]);

  useEffect(() => () => dispatch(clearItemError()), [dispatch]);

  const handle = e => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = e => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);
    const action = item
      ? await dispatch(updateItem({ id: item._id, data: fd }))
      : await dispatch(createItem({ shopId, data: fd }));
    if (createItem.fulfilled.match(action) || updateItem.fulfilled.match(action)) {
      setSuccess(true);
      setTimeout(() => { setSuccess(false); onClose?.(); }, 1500);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#EDE8F0] overflow-hidden shadow-sm">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#F5F0F7]">
        <div>
          <h2 className="text-sm font-semibold text-[#0F172A]">{item ? 'Edit Item' : 'Add Menu Item'}</h2>
          <p className="text-xs text-[#94A3B8] mt-0.5">{item ? 'Update item details' : 'Add a new item to your menu'}</p>
        </div>
        {onClose && (
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#F8F5FC] hover:bg-[#F0EDF3] flex items-center justify-center text-[#64748B] transition-colors">
            <HiOutlineXMark size={16} />
          </button>
        )}
      </div>

      <div className="px-6 py-5">
        {apiError && (
          <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-4">⚠️ {apiError}</div>
        )}
        {success && (
          <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 mb-4">✅ Item {item ? 'updated' : 'added'}!</div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

          {/* Image + Name row */}
          <div className="flex gap-4 items-start">
            {/* Image upload */}
            <label className="cursor-pointer shrink-0">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#F8F5FC] border-2 border-dashed border-[#D4C8DC] flex items-center justify-center hover:border-[#5b3256] transition-colors">
                {preview
                  ? <img src={preview} alt="" className="w-full h-full object-cover" />
                  : <HiOutlinePhoto size={22} className="text-[#C4B9CC]" />
                }
              </div>
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>

            <div className="flex-1 space-y-3">
              <div>
                <FL req>Item Name</FL>
                <FI name="name" value={form.name} onChange={handle} required placeholder="e.g. Chicken Burger" />
              </div>
              <div>
                <FL>Category</FL>
                <FI name="category" value={form.category} onChange={handle} placeholder="Main, Sides, Drinks…" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <FL>Description</FL>
            <textarea name="description" value={form.description} onChange={handle} rows={2}
              placeholder="Describe this item…"
              className="w-full bg-[#FDFAFF] border border-[#EDE8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#C4B9CC] outline-none focus:border-[#5b3256] focus:ring-2 focus:ring-[#5b3256]/10 transition-all resize-none" />
          </div>

          {/* Price row */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <FL req>Price (৳)</FL>
              <FI type="number" name="price" value={form.price} onChange={handle} required min={0} placeholder="0" />
            </div>
            <div>
              <FL>Discount (৳)</FL>
              <FI type="number" name="discountPrice" value={form.discountPrice} onChange={handle} min={0} placeholder="—" />
            </div>
            <div>
              <FL>Prep (min)</FL>
              <FI type="number" name="preparationTime" value={form.preparationTime} onChange={handle} min={1} />
            </div>
          </div>

          {/* Veg toggle */}
          <div className="flex items-center justify-between py-3 px-4 bg-[#F8F5FC] rounded-xl">
            <div>
              <p className="text-sm font-medium text-[#0F172A]">Vegetarian</p>
              <p className="text-xs text-[#94A3B8]">Mark as vegetarian item</p>
            </div>
            <button type="button"
              onClick={() => setForm(p => ({ ...p, isVeg: !p.isVeg }))}
              className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${form.isVeg ? 'bg-green-500' : 'bg-[#D4C8DC]'}`}>
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.isVeg ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading || success}
            className="w-full bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
            {loading ? 'Saving…' : item ? 'Save Changes' : 'Add Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ItemForm;
