import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePhoto } from 'react-icons/hi2';
import {
  createShop, updateShop,
  selectShopLoading, selectShopError, clearShopError,
} from '../../store/slices/shopSlice';

const CATEGORIES = ['restaurant', 'cafe', 'bakery', 'grocery', 'pharmacy', 'other'];

const FL = ({ children, req }) => (
  <label className="block text-xs font-semibold text-[#64748B] uppercase tracking-wide mb-1.5">
    {children}{req && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const FI = ({ className = '', ...p }) => (
  <input className={`w-full bg-[#FDFAFF] border border-[#EDE8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#C4B9CC] outline-none focus:border-[#5b3256] focus:ring-2 focus:ring-[#5b3256]/10 transition-all ${className}`} {...p} />
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-2xl border border-[#EDE8F0] overflow-hidden">
    <div className="px-6 py-4 border-b border-[#F5F0F7]">
      <p className="text-sm font-semibold text-[#0F172A]">{title}</p>
    </div>
    <div className="px-6 py-5 space-y-4">{children}</div>
  </div>
);

const ShopForm = ({ shop }) => {
  const dispatch = useDispatch();
  const loading  = useSelector(selectShopLoading);
  const apiError = useSelector(selectShopError);

  const [form, setForm] = useState({
    name: '', description: '', category: 'restaurant', cuisine: '',
    phone: '', deliveryFee: 0, minOrder: 0,
    'address.street': '', 'address.city': '', 'address.country': '',
    'openingHours.open': '09:00', 'openingHours.close': '22:00',
  });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (shop) {
      setForm({
        name: shop.name || '', description: shop.description || '',
        category: shop.category || 'restaurant', cuisine: shop.cuisine || '',
        phone: shop.phone || '', deliveryFee: shop.deliveryFee ?? 0,
        minOrder: shop.minOrder ?? 0,
        'address.street': shop.address?.street || '',
        'address.city': shop.address?.city || '',
        'address.country': shop.address?.country || '',
        'openingHours.open': shop.openingHours?.open || '09:00',
        'openingHours.close': shop.openingHours?.close || '22:00',
      });
      setPreview(shop.image || '');
    }
  }, [shop]);

  useEffect(() => () => dispatch(clearShopError()), [dispatch]);

  const handle = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

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
    const action = shop
      ? await dispatch(updateShop({ id: shop._id, data: fd }))
      : await dispatch(createShop(fd));
    if (createShop.fulfilled.match(action) || updateShop.fulfilled.match(action)) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

      {apiError && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-base">⚠️</span>{apiError}
        </div>
      )}
      {success && (
        <div className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-base">✅</span> Shop {shop ? 'updated' : 'created'} successfully!
        </div>
      )}

      {/* Cover photo */}
      <Section title="Cover Photo">
        <div className="flex items-center gap-5">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#F8F5FC] border-2 border-dashed border-[#D4C8DC] flex items-center justify-center shrink-0">
            {preview
              ? <img src={preview} alt="" className="w-full h-full object-cover" />
              : <HiOutlinePhoto size={28} className="text-[#C4B9CC]" />
            }
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors">
              <HiOutlinePhoto size={15} />
              {preview ? 'Change Photo' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
            <p className="text-xs text-[#94A3B8] mt-2">JPG, PNG or WebP · Max 5 MB</p>
          </div>
        </div>
      </Section>

      {/* Basic info */}
      <Section title="Basic Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FL req>Shop Name</FL>
            <FI name="name" value={form.name} onChange={handle} required placeholder="e.g. Burger House" />
          </div>
          <div>
            <FL>Category</FL>
            <select name="category" value={form.category} onChange={handle}
              className="w-full bg-[#FDFAFF] border border-[#EDE8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] outline-none focus:border-[#5b3256] focus:ring-2 focus:ring-[#5b3256]/10 transition-all">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FL>Cuisine Type</FL>
            <FI name="cuisine" value={form.cuisine} onChange={handle} placeholder="e.g. Italian, Bangladeshi" />
          </div>
          <div>
            <FL>Phone</FL>
            <FI name="phone" value={form.phone} onChange={handle} placeholder="01xxxxxxxxx" />
          </div>
        </div>
        <div>
          <FL>Description</FL>
          <textarea name="description" value={form.description} onChange={handle} rows={3}
            placeholder="Tell customers about your shop…"
            className="w-full bg-[#FDFAFF] border border-[#EDE8F0] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#C4B9CC] outline-none focus:border-[#5b3256] focus:ring-2 focus:ring-[#5b3256]/10 transition-all resize-none" />
        </div>
      </Section>

      {/* Address */}
      <Section title="Address">
        <div>
          <FL>Street</FL>
          <FI name="address.street" value={form['address.street']} onChange={handle} placeholder="123 Main Street" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FL req>City</FL>
            <FI name="address.city" value={form['address.city']} onChange={handle} placeholder="Dhaka" />
          </div>
          <div>
            <FL>Country</FL>
            <FI name="address.country" value={form['address.country']} onChange={handle} placeholder="Bangladesh" />
          </div>
        </div>
      </Section>

      {/* Hours & fees */}
      <Section title="Hours & Fees">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div><FL>Opens At</FL><FI type="time" name="openingHours.open" value={form['openingHours.open']} onChange={handle} /></div>
          <div><FL>Closes At</FL><FI type="time" name="openingHours.close" value={form['openingHours.close']} onChange={handle} /></div>
          <div><FL>Delivery Fee (৳)</FL><FI type="number" name="deliveryFee" value={form.deliveryFee} onChange={handle} min={0} /></div>
          <div><FL>Min Order (৳)</FL><FI type="number" name="minOrder" value={form.minOrder} onChange={handle} min={0} /></div>
        </div>
      </Section>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-1">
        <button type="submit" disabled={loading || success}
          className="bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold px-7 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Saving…' : shop ? 'Save Changes' : 'Create Shop'}
        </button>
        {success && <p className="text-sm text-emerald-600 font-medium">Saved!</p>}
      </div>
    </form>
  );
};

export default ShopForm;
