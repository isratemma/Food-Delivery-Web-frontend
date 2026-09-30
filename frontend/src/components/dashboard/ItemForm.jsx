import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createItem, updateItem, selectItemLoading, selectItemError, clearItemError } from '../../store/slices/itemSlice';

const inputCls = 'w-full border border-[#E4E4E4] rounded-xl px-3 py-2.5 text-sm text-[#0F172A] placeholder-[#BBBBBB] bg-white outline-none focus:border-[#5b3256] transition-colors';

const ItemForm = ({ shopId, item, onClose }) => {
  const dispatch  = useDispatch();
  const loading   = useSelector(selectItemLoading);
  const apiError  = useSelector(selectItemError);

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
        name:            item.name            || '',
        description:     item.description     || '',
        category:        item.category        || 'Main',
        price:           item.price           ?? '',
        discountPrice:   item.discountPrice   ?? '',
        preparationTime: item.preparationTime ?? 15,
        isVeg:           item.isVeg           ?? false,
      });
      setPreview(item.image || '');
    }
  }, [item]);

  useEffect(() => {
    return () => dispatch(clearItemError());
  }, [dispatch]);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
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
    <div className="bg-white rounded-2xl border border-[#F0E8E4] p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-[#0F172A]">
          {item ? 'Edit Item' : 'Add Menu Item'}
        </h2>
        {onClose && (
          <button onClick={onClose} className="text-sm text-[#64748B] hover:text-[#5b3256]">
            Cancel
          </button>
        )}
      </div>

      {apiError && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-3 py-2.5 mb-4">{apiError}</p>
      )}
      {success && (
        <p className="text-sm text-green-600 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5 mb-4">
          Item {item ? 'updated' : 'added'} successfully!
        </p>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-2">Item Image</label>
          <div className="flex items-center gap-4">
            {preview
              ? <img src={preview} alt="preview" className="w-16 h-16 rounded-xl object-cover border border-[#E4E4E4]" />
              : <div className="w-16 h-16 rounded-xl bg-[#F8FAFC] border border-dashed border-[#DCDCDC] flex items-center justify-center text-xl">🍽️</div>
            }
            <label className="cursor-pointer text-sm font-medium text-[#5b3256] hover:underline">
              {preview ? 'Change' : 'Upload'}
              <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
            </label>
          </div>
        </div>

        {/* Name + Category */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Name <span className="text-red-500">*</span></label>
            <input name="name" value={form.name} onChange={handle} required placeholder="e.g. Chicken Burger" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Category</label>
            <input name="category" value={form.category} onChange={handle} placeholder="Main, Sides, Drinks…" className={inputCls} />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Description</label>
          <textarea name="description" value={form.description} onChange={handle}
            placeholder="Describe this item…" rows={2}
            className={inputCls + ' resize-none'} />
        </div>

        {/* Price + Discount + Time */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Price (৳) <span className="text-red-500">*</span></label>
            <input type="number" name="price" value={form.price} onChange={handle} required min={0} placeholder="0" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Discount Price (৳)</label>
            <input type="number" name="discountPrice" value={form.discountPrice} onChange={handle} min={0} placeholder="—" className={inputCls} />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1.5">Prep Time (min)</label>
            <input type="number" name="preparationTime" value={form.preparationTime} onChange={handle} min={1} className={inputCls} />
          </div>
        </div>

        {/* Veg toggle */}
        <label className="flex items-center gap-2.5 cursor-pointer">
          <div
            className={`w-9 h-5 rounded-full transition-colors flex items-center px-0.5 ${form.isVeg ? 'bg-green-500' : 'bg-[#DCDCDC]'}`}
            onClick={() => setForm(p => ({ ...p, isVeg: !p.isVeg }))}
          >
            <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isVeg ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
          <span className="text-sm text-[#0F172A]">Vegetarian</span>
        </label>

        <button type="submit" disabled={loading}
          className="bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ? 'Saving…' : item ? 'Save Changes' : 'Add Item'}
        </button>
      </form>
    </div>
  );
};

export default ItemForm;
