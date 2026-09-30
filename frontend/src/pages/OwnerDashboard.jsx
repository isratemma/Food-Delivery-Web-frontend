import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { HiOutlinePlus, HiOutlineArrowPath, HiOutlinePower } from 'react-icons/hi2';

import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsCards      from '../components/dashboard/StatsCards';
import ShopForm        from '../components/dashboard/ShopForm';
import ItemList        from '../components/dashboard/ItemList';
import ItemForm        from '../components/dashboard/ItemForm';

import { fetchMyShop, toggleShop, selectMyShop, selectShopLoading } from '../store/slices/shopSlice';
import { fetchShopItems, selectItems } from '../store/slices/itemSlice';
import { selectUser } from '../store/slices/authSlice';

/* ── Overview tab ─────────────────────────────────────────── */
const Overview = () => {
  const dispatch  = useDispatch();
  const shop      = useSelector(selectMyShop);
  const items     = useSelector(selectItems);
  const loading   = useSelector(selectShopLoading);
  const navigate  = useNavigate();

  useEffect(() => {
    dispatch(fetchMyShop());
  }, [dispatch]);

  useEffect(() => {
    if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id }));
  }, [shop?._id, dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">Overview</h1>
          <p className="text-sm text-[#64748B] mt-0.5">{shop?.name || 'Set up your shop to get started'}</p>
        </div>
        {shop && (
          <button
            onClick={() => dispatch(toggleShop(shop._id))}
            disabled={loading}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl border transition-colors disabled:opacity-60
              ${shop.isOpen
                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                : 'border-[#E4E4E4] bg-white text-[#64748B] hover:bg-[#F8FAFC]'
              }`}
          >
            <HiOutlinePower size={16} />
            {shop.isOpen ? 'Shop is Open' : 'Shop is Closed'}
          </button>
        )}
      </div>

      <StatsCards shop={shop} itemCount={items.length} />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => navigate('/dashboard/items')}
          className="flex items-center gap-3 bg-white border border-[#F0E8E4] rounded-2xl px-5 py-4 hover:border-[#5b3256] hover:bg-[#f5eef4] transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f5eef4] flex items-center justify-center">
            <HiOutlinePlus size={18} className="text-[#5b3256]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Add Menu Item</p>
            <p className="text-xs text-[#64748B]">Add a new item to your menu</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/dashboard/shop')}
          className="flex items-center gap-3 bg-white border border-[#F0E8E4] rounded-2xl px-5 py-4 hover:border-[#5b3256] hover:bg-[#f5eef4] transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-[#f5eef4] flex items-center justify-center">
            <HiOutlineArrowPath size={18} className="text-[#5b3256]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">Update Shop Info</p>
            <p className="text-xs text-[#64748B]">Edit hours, address and details</p>
          </div>
        </button>
      </div>

      {/* Recent items preview */}
      {items.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-[#0F172A]">Recent Items</p>
            <button onClick={() => navigate('/dashboard/items')} className="text-xs text-[#5b3256] hover:underline">
              See all
            </button>
          </div>
          <ItemList items={items.slice(0, 4)} onEdit={() => navigate('/dashboard/items')} />
        </div>
      )}
    </div>
  );
};

/* ── Shop tab ─────────────────────────────────────────────── */
const MyShop = () => {
  const dispatch = useDispatch();
  const shop     = useSelector(selectMyShop);

  useEffect(() => {
    dispatch(fetchMyShop());
  }, [dispatch]);

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-xl font-bold text-[#0F172A]">My Shop</h1>
      <ShopForm shop={shop} />
    </div>
  );
};

/* ── Items tab ────────────────────────────────────────────── */
const MenuItems = () => {
  const dispatch = useDispatch();
  const shop     = useSelector(selectMyShop);
  const items    = useSelector(selectItems);
  const [editing, setEditing] = useState(null);  // null = no form, item obj = edit, 'new' = create
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(fetchMyShop());
  }, [dispatch]);

  useEffect(() => {
    if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id }));
  }, [shop?._id, dispatch]);

  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClose = () => {
    setEditing(null);
    setShowForm(false);
    if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id }));
  };

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-3">🏪</span>
        <p className="font-semibold text-[#0F172A]">No shop found</p>
        <p className="text-sm text-[#64748B] mt-1">Create your shop first before adding items</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#0F172A]">Menu Items</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <HiOutlinePlus size={16} />
          Add Item
        </button>
      </div>

      {showForm && (
        <ItemForm
          shopId={shop._id}
          item={editing}
          onClose={handleClose}
        />
      )}

      <ItemList items={items} onEdit={handleEdit} />
    </div>
  );
};

/* ── Settings tab ─────────────────────────────────────────── */
const Settings = () => {
  const user = useSelector(selectUser);
  return (
    <div className="max-w-lg space-y-4">
      <h1 className="text-xl font-bold text-[#0F172A]">Settings</h1>
      <div className="bg-white border border-[#F0E8E4] rounded-2xl p-6 space-y-4">
        <div>
          <p className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wide mb-3">Account</p>
          <div className="space-y-3">
            {[
              { label: 'Full Name', value: user?.fullName },
              { label: 'Email',     value: user?.email },
              { label: 'Mobile',    value: user?.mobile },
              { label: 'Role',      value: user?.role },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-between py-2 border-b border-[#F8F4F7] last:border-0">
                <span className="text-sm text-[#64748B]">{f.label}</span>
                <span className="text-sm font-medium text-[#0F172A]">{f.value || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main OwnerDashboard ──────────────────────────────────── */
const OwnerDashboard = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index          element={<Overview />} />
        <Route path="shop"    element={<MyShop />} />
        <Route path="items"   element={<MenuItems />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </DashboardLayout>
  );
};

export default OwnerDashboard;
