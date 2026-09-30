import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlineArrowLeft, HiOutlinePhoto } from 'react-icons/hi2';
import {
  createShop, updateShop,
  fetchMyShop,
  selectMyShop, selectShopLoading, selectShopError, clearShopError,
} from '../store/slices/shopSlice';

const CATEGORIES = ['restaurant', 'cafe', 'bakery', 'grocery', 'pharmacy', 'other'];

const Label = ({ children, required }) => (
  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">
    {children}{required && <span className="text-red-500 ml-0.5">*</span>}
  </label>
);

const Input = ({ className = '', ...props }) => (
  <input
    className={`w-full border border-[#E4E4E4] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none focus:border-[#5b3256] transition-colors ${className}`}
    {...props}
  />
);

const Section = ({ title, children }) => (
  <div className="bg-white border border-[#F0E8E4] rounded-2xl p-6 space-y-4">
    <p className="text-sm font-semibold text-[#0F172A] border-b border-[#F8F4F7] pb-3">{title}</p>
    {children}
  </div>
);

const CreateEditShopPage = () => {
  const navigate  = useNavigate();
  const dispatch  = useDispatch();
  const myShop    = useSelector(selectMyShop);
  const loading   = useSelector(selectShopLoading);
  const apiError  = useSelector(selectShopError);

  const isEdit = !!myShop;

  const [form, setForm] = useState({
    name: '', description: '', category: 'restaurant', cuisine: '', phone: '',
    deliveryFee: 0, minOrder: 0,
    street: '', city: '', country: '',
    openTime: '09:00', closeTime: '22:00',
  });
  const [image, setImage]     = useState(null);
  const [preview, setPreview] = useState('');
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState(false);

  // Load existing shop on mount
  useEffect(() => {
    dispatch(fetchMyShop());
    return () => dispatch(clearShopError());
  }, [dispatch]);

  // Populate form when myShop loads
  useEffect(() => {
    if (myShop) {
      setForm({
        name:        myShop.name            || '',
        description: myShop.description     || '',
        category:    myShop.category        || 'restaurant',
        cuisine:     myShop.cuisine         || '',
        phone:       myShop.phone           || '',
        deliveryFee: myShop.deliveryFee     ?? 0,
        minOrder:    myShop.minOrder        ?? 0,
        street:      myShop.address?.street  || '',
        city:        myShop.address?.city    || '',
        country:     myShop.address?.country || '',
        openTime:    myShop.openingHours?.open  || '09:00',
        closeTime:   myShop.openingHours?.close || '22:00',
      });
      setPreview(myShop.image || '');
    }
  }, [myShop]);

  const handle = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Shop name is required';
    if (!form.city.trim()) e.city = 'City is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }

    const fd = new FormData();
    fd.append('name',        form.name.trim());
    fd.append('description', form.description);
    fd.append('category',    form.category);
    fd.append('cuisine',     form.cuisine);
    fd.append('phone',       form.phone);
    fd.append('deliveryFee', form.deliveryFee);
    fd.append('minOrder',    form.minOrder);
    fd.append('address.street',  form.street);
    fd.append('address.city',    form.city);
    fd.append('address.country', form.country);
    fd.append('openingHours.open',  form.openTime);
    fd.append('openingHours.close', form.closeTime);
    if (image) fd.append('image', image);

    const action = isEdit
      ? await dispatch(updateShop({ id: myShop._id, data: fd }))
      : await dispatch(createShop(fd));

    if (createShop.fulfilled.match(action) || updateShop.fulfilled.match(action)) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <div className="bg-white border-b border-[#F0E8E4] sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')}
            className="p-2 rounded-xl text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#5b3256] transition-colors">
            <HiOutlineArrowLeft size={18} />
          </button>
          <h1 className="text-base font-semibold text-[#0F172A]">
            {isEdit ? 'Edit Shop' : 'Create Your Shop'}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

        {/* Alerts */}
        {apiError && (
          <div className="mb-5 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
            {apiError}
          </div>
        )}
        {success && (
          <div className="mb-5 text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            Shop {isEdit ? 'updated' : 'created'} successfully! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-5">

          {/* Cover Image */}
          <Section title="Shop Image">
            <div className="flex items-center gap-5">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-[#F8FAFC] border-2 border-dashed border-[#E4E4E4] flex items-center justify-center shrink-0">
                {preview
                  ? <img src={preview} alt="preview" className="w-full h-full object-cover" />
                  : <HiOutlinePhoto size={28} className="text-[#DCDCDC]" />
                }
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
                  <HiOutlinePhoto size={15} />
                  {preview ? 'Change Image' : 'Upload Image'}
                  <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                </label>
                <p className="text-xs text-[#94A3B8] mt-2">JPG, PNG or WebP. Max 5 MB.</p>
              </div>
            </div>
          </Section>

          {/* Basic Info */}
          <Section title="Basic Information">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label required>Shop Name</Label>
                <Input name="name" value={form.name} onChange={handle} placeholder="e.g. Burger House" />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <Label>Category</Label>
                <select name="category" value={form.category} onChange={handle}
                  className="w-full border border-[#E4E4E4] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] bg-white outline-none focus:border-[#5b3256] transition-colors">
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Cuisine Type</Label>
                <Input name="cuisine" value={form.cuisine} onChange={handle} placeholder="e.g. Italian, Bangladeshi" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input name="phone" value={form.phone} onChange={handle} placeholder="01xxxxxxxxx" />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <textarea name="description" value={form.description} onChange={handle}
                placeholder="Tell customers about your shop…" rows={3}
                className="w-full border border-[#E4E4E4] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none focus:border-[#5b3256] transition-colors resize-none" />
            </div>
          </Section>

          {/* Address */}
          <Section title="Address">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <Label>Street</Label>
                <Input name="street" value={form.street} onChange={handle} placeholder="123 Main Street" />
              </div>
              <div>
                <Label required>City</Label>
                <Input name="city" value={form.city} onChange={handle} placeholder="Dhaka" />
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <Label>Country</Label>
                <Input name="country" value={form.country} onChange={handle} placeholder="Bangladesh" />
              </div>
            </div>
          </Section>

          {/* Hours & Fees */}
          <Section title="Hours & Fees">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <Label>Opens At</Label>
                <Input type="time" name="openTime" value={form.openTime} onChange={handle} />
              </div>
              <div>
                <Label>Closes At</Label>
                <Input type="time" name="closeTime" value={form.closeTime} onChange={handle} />
              </div>
              <div>
                <Label>Delivery Fee (৳)</Label>
                <Input type="number" name="deliveryFee" value={form.deliveryFee} onChange={handle} min={0} />
              </div>
              <div>
                <Label>Min Order (৳)</Label>
                <Input type="number" name="minOrder" value={form.minOrder} onChange={handle} min={0} />
              </div>
            </div>
          </Section>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button type="submit" disabled={loading || success}
              className="bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Shop'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')}
              className="text-sm text-[#64748B] hover:text-[#5b3256] px-4 py-3 transition-colors">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShopPage;
