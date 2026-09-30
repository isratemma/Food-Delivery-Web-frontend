import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createShop, updateShop, selectShopLoading, selectShopError, clearShopError } from '../../store/slices/shopSlice';

const CATEGORIES = ['restaurant', 'cafe', 'bakery', 'grocery', 'pharmacy', 'other'];

const inputCls = 'w-full border border-[#E4E4E4] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none focus:border-[#5b3256] transition-colors';

const ShopForm = ({ shop }) => {
  const dispatch  = useDispatch();
  const loading   = useSelector(selectShopLoading);
  const apiError  = useSelector(selectShopError);

  const [form, setForm] = useState({
    name: '', description: '', category: 'restaurant', cuisine: '',
    phone: '', deliveryFee: 0, minOrder: 0,
    'address.street': '', 'address.city': '', 'address.country': '',
    'openingHours.open': '09:00', 'openingHours.close': '22:00',
  });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState('');
  const [success, setSuccess] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (shop) {
      setForm({
        name:        shop.name        || '',
        description: shop.description || '',
        category:    shop.category    || 'restaurant',
        cuisine:     shop.cuisine     || '',
        phone:       shop.phone       || '',
        deliveryFee: shop.deliveryFee ?? 0,
        minOrder:    shop.minOrder    ?? 0,
        'address.street':  shop.address?.street  || '',
        'address.city':    shop.address?.city    || '',
        'address.country': shop.address?.country || '',
        'openingHours.open':  shop.openingHours?.open  || '09:00',
        'openingHours.close': shop.openingHours?.close || '22:00',
      });
      setPreview(shop.image || '');
    }
  }, [shop]);

  useEffect(() => {
    return () => dispatch(clearShopError());
  }, [dispatch]);

  const handle = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();

    // Flatten nested fields into FormData
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (image) fd.append('image', image);

    const action = shop
      ? await dispatch(updateShop({ id: shop._id, data: fd }))
      : await dispatch(createShop(fd));

    if (createShop.fulfilled.match(action) || updateShop.fulfilled.match(action)) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8E4] p-6">
      <h2 className="text-base font-semibold text-[#0F172A] mb-5">
        {shop ? 'Edit Shop' : 'Create Your Shop'}
      </h2>

      {apiError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-4">{apiError}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 mb-4">
          Shop {shop ? 'updated' : 'created'} successfully!
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-2">Shop Image</label>
          <div className="flex items-center gap-4">
            {preview
              ? <img src={preview} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-[#E4E4E4]" />
              : <div className="w-20 h-20 rounded-xl bg-[#F8FAFC] border border-dashed border-[#DCDCDC] flex items-center justify-center text-2xl">🏪</div>
            }
            <label className="cursor-pointer text-sm font-medium text-[#5b3256] hover:underline">
              {preview ? 'Change image' : 'Upload image'}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Shop Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handle} required placeholder="e.g. Burger House" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Category</label>
            <select name="category" value={form.category} onChange={handle} className={inputCls}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Cuisine</label>
            <input name="cuisine" value={form.cuisine} onChange={handle} placeholder="e.g. Italian, Bangladeshi" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Phone</label>
            <input name="phone" value={form.phone} onChange={handle} placeholder="01xxxxxxxxx" className={inputCls} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handle}
            placeholder="Tell customers about your shop…" rows={3}
            className={inputCls + ' resize-none'} />
        </div>

        {/* Address */}
        <div>
          <p className="text-sm font-medium text-[#0F172A] mb-2">Address</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input name="address.street"  value={form['address.street']}  onChange={handle} placeholder="Street"  className={inputCls} />
            <input name="address.city"    value={form['address.city']}    onChange={handle} placeholder="City"    className={inputCls} />
            <input name="address.country" value={form['address.country']} onChange={handle} placeholder="Country" className={inputCls} />
          </div>
        </div>

        {/* Fees + Hours */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Delivery Fee (৳)</label>
            <input type="number" name="deliveryFee" value={form.deliveryFee} onChange={handle} min={0} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Min Order (৳)</label>
            <input type="number" name="minOrder" value={form.minOrder} onChange={handle} min={0} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Opens at</label>
            <input type="time" name="openingHours.open" value={form['openingHours.open']} onChange={handle} className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Closes at</label>
            <input type="time" name="openingHours.close" value={form['openingHours.close']} onChange={handle} className={inputCls} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Saving…' : shop ? 'Save Changes' : 'Create Shop'}
        </button>
      </form>
    </div>
  );
};

export default ShopForm;
