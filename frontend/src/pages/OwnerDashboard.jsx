import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlinePower,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShieldCheck,
} from 'react-icons/hi2';

import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsCards      from '../components/dashboard/StatsCards';
import ShopForm        from '../components/dashboard/ShopForm';
import ItemList        from '../components/dashboard/ItemList';
import ItemForm        from '../components/dashboard/ItemForm';

import { fetchMyShop, toggleShop, selectMyShop, selectShopLoading } from '../store/slices/shopSlice';
import { fetchShopItems, selectItems }                               from '../store/slices/itemSlice';
import { selectUser }                                                from '../store/slices/authSlice';

/* ─── helpers ──────────────────────────────────────────────── */
const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-bold text-[#0F172A]">{title}</h1>
      {subtitle && <p className="text-sm text-[#94A3B8] mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

const EmptyShop = ({ onSetup }) => (
  <div className="bg-white rounded-2xl border border-[#EDE8F0] flex flex-col items-center justify-center py-24 text-center px-4">
    <div className="w-16 h-16 rounded-2xl bg-[#F8F5FC] flex items-center justify-center mb-4">
      <span className="text-4xl">🏪</span>
    </div>
    <p className="text-base font-semibold text-[#0F172A] mb-1">No shop yet</p>
    <p className="text-sm text-[#94A3B8] mb-5">Create your shop to start receiving orders</p>
    <button onClick={onSetup}
      className="flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
      <HiOutlinePlus size={16} /> Create Shop
    </button>
  </div>
);

/* ─── Overview ──────────────────────────────────────────────── */
const Overview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shop     = useSelector(selectMyShop);
  const items    = useSelector(selectItems);
  const loading  = useSelector(selectShopLoading);

  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);
  useEffect(() => { if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id })); }, [shop?._id, dispatch]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        subtitle={shop?.name || 'Welcome to your dashboard'}
        action={shop && (
          <button
            onClick={() => dispatch(toggleShop(shop._id))}
            disabled={loading}
            className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl border-2 transition-all disabled:opacity-50
              ${shop.isOpen
                ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                : 'border-[#EDE8F0] bg-white text-[#64748B] hover:bg-[#F8F5FC]'
              }`}
          >
            <HiOutlinePower size={16} />
            {shop.isOpen ? 'Open' : 'Closed'}
          </button>
        )}
      />

      <StatsCards shop={shop} itemCount={items.length} />

      {!shop
        ? <EmptyShop onSetup={() => navigate('/dashboard/shop')} />
        : (
          <>
            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: '➕',
                  title: 'Add Menu Item',
                  desc: 'Add a new dish to your menu',
                  to: '/dashboard/items',
                  btn: 'Add item',
                },
                {
                  icon: '✏️',
                  title: 'Edit Shop Info',
                  desc: 'Update hours, address and details',
                  to: '/dashboard/shop',
                  btn: 'Edit shop',
                },
              ].map(a => (
                <div key={a.title}
                  className="bg-white rounded-2xl border border-[#EDE8F0] p-5 flex items-center justify-between gap-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#F8F5FC] flex items-center justify-center text-xl shrink-0">
                      {a.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#0F172A]">{a.title}</p>
                      <p className="text-xs text-[#94A3B8] mt-0.5">{a.desc}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate(a.to)}
                    className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#5b3256] bg-[#F8F5FC] hover:bg-[#F0EDF3] px-3 py-1.5 rounded-lg transition-colors">
                    {a.btn} <HiOutlineArrowTopRightOnSquare size={12} />
                  </button>
                </div>
              ))}
            </div>

            {/* Recent items */}
            {items.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-[#0F172A]">Recent Items</p>
                  <button onClick={() => navigate('/dashboard/items')}
                    className="text-xs text-[#5b3256] font-semibold hover:underline">
                    View all →
                  </button>
                </div>
                <ItemList items={items.slice(0, 5)} onEdit={() => navigate('/dashboard/items')} />
              </div>
            )}
          </>
        )
      }
    </div>
  );
};

/* ─── My Shop ───────────────────────────────────────────────── */
const MyShop = () => {
  const dispatch = useDispatch();
  const shop     = useSelector(selectMyShop);
  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);

  return (
    <div className="max-w-2xl space-y-1">
      <PageHeader
        title={shop ? 'Edit Shop' : 'Create Shop'}
        subtitle={shop ? 'Update your shop information' : 'Set up your shop profile'}
      />
      <ShopForm shop={shop} />
    </div>
  );
};

/* ─── Menu Items ────────────────────────────────────────────── */
const MenuItems = () => {
  const dispatch = useDispatch();
  const shop     = useSelector(selectMyShop);
  const items    = useSelector(selectItems);
  const [editing,  setEditing]  = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);
  useEffect(() => { if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id })); }, [shop?._id, dispatch]);

  const handleEdit = item => { setEditing(item); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleClose = () => {
    setEditing(null); setShowForm(false);
    if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id }));
  };

  if (!shop) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#F8F5FC] flex items-center justify-center mb-4"><span className="text-3xl">🏪</span></div>
      <p className="font-semibold text-[#0F172A]">Create your shop first</p>
      <p className="text-sm text-[#94A3B8] mt-1">You need a shop before adding menu items</p>
    </div>
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Menu Items"
        subtitle={`${items.length} item${items.length !== 1 ? 's' : ''} on your menu`}
        action={
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-[#5b3256]/20">
            <HiOutlinePlus size={16} /> Add Item
          </button>
        }
      />

      {showForm && (
        <ItemForm shopId={shop._id} item={editing} onClose={handleClose} />
      )}

      <ItemList items={items} onEdit={handleEdit} />
    </div>
  );
};

/* ─── Settings ──────────────────────────────────────────────── */
const Settings = () => {
  const user = useSelector(selectUser);

  const fields = [
    { icon: HiOutlineUser,        label: 'Full Name', value: user?.fullName },
    { icon: HiOutlineEnvelope,    label: 'Email',     value: user?.email },
    { icon: HiOutlinePhone,       label: 'Mobile',    value: user?.mobile },
    { icon: HiOutlineShieldCheck, label: 'Role',      value: user?.role },
  ];

  return (
    <div className="max-w-lg space-y-5">
      <PageHeader title="Settings" subtitle="Manage your account details" />

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#EDE8F0] overflow-hidden">
        {/* Top banner */}
        <div className="h-16 w-full" style={{ background: 'linear-gradient(135deg,#3d1f3a,#5b3256,#7a4472)' }} />
        <div className="px-6 pb-6 -mt-8">
          <div className="w-14 h-14 rounded-2xl bg-[#5b3256] border-4 border-white flex items-center justify-center text-white text-xl font-bold overflow-hidden mb-4">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              : (user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'OW')
            }
          </div>
          <p className="text-base font-bold text-[#0F172A]">{user?.fullName}</p>
          <p className="text-sm text-[#94A3B8]">{user?.email}</p>
        </div>
      </div>

      {/* Info rows */}
      <div className="bg-white rounded-2xl border border-[#EDE8F0] divide-y divide-[#F5F0F7]">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-[#F8F5FC] flex items-center justify-center shrink-0">
              <Icon size={16} className="text-[#5b3256]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#94A3B8] font-medium">{label}</p>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{value || '—'}</p>
            </div>
            <button className="text-xs text-[#5b3256] font-semibold hover:underline shrink-0">Edit</button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-50">
          <p className="text-sm font-semibold text-red-600">Danger Zone</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">Irreversible account actions</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Delete account</p>
            <p className="text-xs text-[#94A3B8]">Permanently remove your account and data</p>
          </div>
          <button className="text-sm text-red-500 font-semibold border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Root ──────────────────────────────────────────────────── */
const OwnerDashboard = () => (
  <DashboardLayout>
    <Routes>
      <Route index           element={<Overview />} />
      <Route path="shop"     element={<MyShop />} />
      <Route path="items"    element={<MenuItems />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  </DashboardLayout>
);

export default OwnerDashboard;
