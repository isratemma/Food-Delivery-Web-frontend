import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlinePlus,
  HiOutlinePower,
  HiOutlinePencilSquare,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineStar,
} from 'react-icons/hi2';

import DashboardLayout from '../components/dashboard/DashboardLayout';
import StatsCards      from '../components/dashboard/StatsCards';
import ShopForm        from '../components/dashboard/ShopForm';
import ItemList        from '../components/dashboard/ItemList';
import ItemForm        from '../components/dashboard/ItemForm';

import { fetchMyShop, toggleShop, selectMyShop, selectShopLoading } from '../store/slices/shopSlice';
import { fetchShopItems, selectItems }                               from '../store/slices/itemSlice';
import { selectUser }                                                from '../store/slices/authSlice';

/* ── Quick action card ─────────────────────────────────────── */
const QuickAction = ({ icon, label, sub, bg, onClick }) => (
  <button onClick={onClick}
    className="flex flex-col items-center justify-center gap-3 rounded-2xl p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
    style={{ background: bg, minHeight: 110 }}>
    <div className="text-3xl">{icon}</div>
    <div>
      <p className="text-sm font-semibold text-[#0F172A] leading-tight">{label}</p>
      {sub && <p className="text-[11px] text-[#94A3B8] mt-0.5">{sub}</p>}
    </div>
  </button>
);

/* ── Spotlight item card ──────────────────────────────────── */
const SpotlightCard = ({ item }) => (
  <div className="bg-white rounded-2xl border border-[#F0F0F4] overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-32 overflow-hidden bg-gradient-to-br from-[#f5eef4] to-[#ede0eb] relative">
      {item.image
        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
      }
      {item.tag && (
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: item.tagColor || '#f58020', color: 'white' }}>
          {item.tag}
        </span>
      )}
    </div>
    <div className="p-3">
      <p className="text-sm font-semibold text-[#0F172A] truncate">{item.name}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-sm font-bold text-[#5b3256]">৳{item.price}</span>
        <span className="flex items-center gap-0.5 text-xs text-[#94A3B8]">
          <HiOutlineStar size={11} className="text-yellow-400" />
          {item.rating?.toFixed(1) || '4.8'}
        </span>
      </div>
    </div>
  </div>
);

/* ── Review card ──────────────────────────────────────────── */
const ReviewCard = ({ name, text, rating, avatar }) => (
  <div className="flex gap-3 py-3 border-b border-[#F5F6FA] last:border-0">
    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#ede0eb] flex items-center justify-center shrink-0 text-sm font-bold text-[#4a2845]">
      {avatar || name?.[0]}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-[#0F172A]">{name}</p>
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <HiOutlineStar key={i} size={11} className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
          ))}
        </div>
      </div>
      <p className="text-xs text-[#64748B] mt-0.5 line-clamp-2">{text}</p>
    </div>
  </div>
);

/* ── PageHeader ───────────────────────────────────────────── */
const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-bold text-[#0F172A]">{title}</h1>
      {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* ── Overview ─────────────────────────────────────────────── */
const Overview = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shop     = useSelector(selectMyShop);
  const items    = useSelector(selectItems);
  const loading  = useSelector(selectShopLoading);
  const user     = useSelector(selectUser);

  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);
  useEffect(() => { if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id })); }, [shop?._id, dispatch]);

  const QUICK_ACTIONS = [
    { icon: '🛒', label: 'New order',     sub: 'POS / manual',  bg: '#fff3e0', onClick: () => {} },
    { icon: '🍽️', label: 'Add dish',      sub: 'Menu item',     bg: '#e8f5e9', onClick: () => navigate('/dashboard/items') },
    { icon: '🎁', label: 'Launch promo',  sub: 'New coupon',    bg: '#fce4ec', onClick: () => {} },
    { icon: '🖥️', label: 'Kitchen',       sub: 'Live KDS',      bg: '#e3f2fd', onClick: () => {} },
    { icon: '🗺️', label: 'Track riders',  sub: 'Live map',      bg: '#ede7f6', onClick: () => {} },
    { icon: '📊', label: 'Reports',       sub: 'Sales & more',  bg: '#fff9c4', onClick: () => {} },
  ];

  const SAMPLE_REVIEWS = [
    { name: 'Aisha K.', text: 'Crust perfect every time. New favorite!',    rating: 5 },
    { name: 'Marcus C.', text: 'Healthy bowl is my new lunch ritual.',       rating: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Owner'} 👋
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">Main overview</p>
        </div>
        <div className="flex items-center gap-2">
          {shop && (
            <button
              onClick={() => dispatch(toggleShop(shop._id))}
              disabled={loading}
              className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all disabled:opacity-50
                ${shop.isOpen
                  ? 'border-green-200 bg-green-50 text-green-700'
                  : 'border-gray-200 bg-white text-gray-500'
                }`}>
              <HiOutlinePower size={15} />
              {shop.isOpen ? 'Open' : 'Closed'}
            </button>
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-bold text-[#0F172A]">Quick actions</p>
            <p className="text-xs text-[#94A3B8]">Jump straight to what you need</p>
          </div>
          <button className="text-xs text-[#5b3256] font-semibold hover:underline">Customize →</button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(a => <QuickAction key={a.label} {...a} />)}
        </div>
      </div>

      {/* Stats */}
      <StatsCards shop={shop} itemCount={items.length} />

      {/* Spotlight + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Today's spotlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F4] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Today&apos;s spotlight</p>
              <p className="text-xs text-[#94A3B8]">Hot dishes driving the lunch rush</p>
            </div>
            <button onClick={() => navigate('/dashboard/items')}
              className="text-xs text-[#5b3256] font-semibold hover:underline">
              Full menu
            </button>
          </div>

          {items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {items.slice(0, 4).map((item, i) => (
                <SpotlightCard key={item._id} item={{
                  ...item,
                  tag: i === 0 ? 'Hot' : i === 1 ? 'Premium' : i === 2 ? 'Healthy' : null,
                  tagColor: i === 0 ? '#ef4444' : i === 1 ? '#7c3aed' : '#16a34a',
                }} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-sm font-semibold text-[#0F172A]">No items yet</p>
              <p className="text-xs text-[#94A3B8] mb-4">Add items to see them here</p>
              <button onClick={() => navigate('/dashboard/items')}
                className="flex items-center gap-1.5 bg-[#5b3256] hover:bg-[#4a2845] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                <HiOutlinePlus size={13} /> Add item
              </button>
            </div>
          )}
        </div>

        {/* Customers love it */}
        <div className="bg-white rounded-2xl border border-[#F0F0F4] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Customers love it</p>
              <p className="text-xs text-[#94A3B8]">Latest 5★ reviews</p>
            </div>
            <button className="text-xs text-[#5b3256] font-semibold hover:underline">All</button>
          </div>
          {shop
            ? SAMPLE_REVIEWS.map(r => <ReviewCard key={r.name} {...r} />)
            : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <span className="text-3xl mb-2">⭐</span>
                <p className="text-xs text-[#94A3B8]">Reviews will appear here once customers rate your items</p>
              </div>
            )
          }
        </div>
      </div>

      {/* No shop CTA */}
      {!shop && (
        <div className="bg-white rounded-2xl border border-[#F0F0F4] flex flex-col items-center justify-center py-16 text-center">
          <span className="text-5xl mb-3">🏪</span>
          <p className="text-base font-bold text-[#0F172A] mb-1">Create your shop</p>
          <p className="text-sm text-[#94A3B8] mb-5">Set up your shop profile to start receiving orders</p>
          <button onClick={() => navigate('/dashboard/shop')}
            className="flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-colors">
            <HiOutlinePlus size={16} /> Create shop
          </button>
        </div>
      )}
    </div>
  );
};

/* ── My Shop ──────────────────────────────────────────────── */
const MyShop = () => {
  const dispatch = useDispatch();
  const shop     = useSelector(selectMyShop);
  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={shop ? 'Edit Shop' : 'Create Shop'}
        subtitle={shop ? 'Update your shop information' : 'Set up your shop profile'}
      />
      <ShopForm shop={shop} />
    </div>
  );
};

/* ── Menu Items ───────────────────────────────────────────── */
const MenuItems = () => {
  const dispatch = useDispatch();
  const shop     = useSelector(selectMyShop);
  const items    = useSelector(selectItems);
  const [editing,  setEditing]  = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);
  useEffect(() => { if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id })); }, [shop?._id, dispatch]);

  const handleEdit  = item => { setEditing(item); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  const handleClose = () => {
    setEditing(null); setShowForm(false);
    if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id }));
  };

  if (!shop) return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <span className="text-5xl mb-3">🏪</span>
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
          <button onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm shadow-[#d4aac8]/20">
            <HiOutlinePlus size={15} /> Add Item
          </button>
        }
      />
      {showForm && <ItemForm shopId={shop._id} item={editing} onClose={handleClose} />}
      <ItemList items={items} onEdit={handleEdit} />
    </div>
  );
};

/* ── Settings ─────────────────────────────────────────────── */
const Settings = () => {
  const user = useSelector(selectUser);
  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  return (
    <div className="max-w-lg space-y-5">
      <PageHeader title="Settings" subtitle="Manage your account" />

      {/* Profile card */}
      <div className="bg-white rounded-2xl border border-[#F0F0F4] overflow-hidden">
        <div className="h-16"
          style={{ background: 'linear-gradient(160deg,#3d1f3a 0%,#5b3256 60%,#7a4472 100%)' }} />
        <div className="px-6 pb-6 -mt-7">
          <div className="w-14 h-14 rounded-2xl bg-[#5b3256] border-4 border-white flex items-center justify-center text-white text-xl font-bold overflow-hidden mb-3">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-full h-full object-cover" /> : initials}
          </div>
          <p className="text-base font-bold text-[#0F172A]">{user?.fullName}</p>
          <p className="text-sm text-[#94A3B8]">{user?.email}</p>
        </div>
      </div>

      {/* Fields */}
      <div className="bg-white rounded-2xl border border-[#F0F0F4] divide-y divide-[#F5F6FA]">
        {[
          { icon: HiOutlineUser,        label: 'Full Name', value: user?.fullName },
          { icon: HiOutlineEnvelope,    label: 'Email',     value: user?.email    },
          { icon: HiOutlinePhone,       label: 'Mobile',    value: user?.mobile   },
          { icon: HiOutlineShieldCheck, label: 'Role',      value: user?.role     },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center gap-4 px-5 py-4">
            <div className="w-8 h-8 rounded-xl bg-[#f5eef4] flex items-center justify-center shrink-0">
              <Icon size={15} className="text-[#5b3256]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#94A3B8]">{label}</p>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{value || '—'}</p>
            </div>
            <button className="text-xs text-[#5b3256] font-semibold hover:underline">Edit</button>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-50">
          <p className="text-sm font-semibold text-red-500">Danger Zone</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Delete account</p>
            <p className="text-xs text-[#94A3B8]">Permanently remove your account</p>
          </div>
          <button className="text-sm text-red-500 font-semibold border border-red-200 px-4 py-1.5 rounded-xl hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Root ─────────────────────────────────────────────────── */
const OwnerDashboard = () => (
  <DashboardLayout>
    <Routes>
      <Route index           element={<Overview />}  />
      <Route path="shop"     element={<MyShop />}    />
      <Route path="items"    element={<MenuItems />} />
      <Route path="settings" element={<Settings />}  />
    </Routes>
  </DashboardLayout>
);

export default OwnerDashboard;
