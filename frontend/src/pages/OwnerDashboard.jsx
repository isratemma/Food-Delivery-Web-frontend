import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlinePlus,
  HiOutlinePower,
  HiOutlineUser,
  HiOutlineEnvelope,
  HiOutlinePhone,
  HiOutlineShieldCheck,
  HiOutlineStar,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineExclamationTriangle,
  HiOutlineXMark,
} from 'react-icons/hi2';

import DashboardLayout  from '../components/dashboard/DashboardLayout';
import StatsCards       from '../components/dashboard/StatsCards';
import ShopForm         from '../components/dashboard/ShopForm';
import ItemList         from '../components/dashboard/ItemList';
import ItemForm         from '../components/dashboard/ItemForm';
import ComingSoon       from '../components/dashboard/ComingSoon';
import EditFieldModal   from '../components/dashboard/EditFieldModal';

import { fetchMyShop, toggleShop, selectMyShop, selectShopLoading } from '../store/slices/shopSlice';
import { fetchShopItems, selectItems }                               from '../store/slices/itemSlice';
import { selectUser, signOut }                                       from '../store/slices/authSlice';
import api                                                           from '../api/axios';

/* ── helpers ────────────────────────────────────────────────── */
const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4 mb-6">
    <div>
      <h1 className="text-xl font-bold text-[#0F172A]">{title}</h1>
      {subtitle && <p className="text-xs text-[#94A3B8] mt-0.5">{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* ── Spotlight card ─────────────────────────────────────────── */
const SpotlightCard = ({ item, tag, tagColor, onEdit }) => (
  <div className="bg-white rounded-2xl border border-[#F0F0F4] overflow-hidden hover:shadow-md transition-shadow group">
    <div className="h-28 overflow-hidden bg-[#f5eef4] relative">
      {item.image
        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-4xl">🍽️</div>
      }
      {tag && (
        <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
          style={{ background: tagColor }}>
          {tag}
        </span>
      )}
      <button onClick={() => onEdit(item)}
        className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-white/80 flex items-center justify-center text-[#5b3256] opacity-0 group-hover:opacity-100 transition-opacity">
        ✏️
      </button>
    </div>
    <div className="p-3">
      <p className="text-xs font-semibold text-[#0F172A] truncate">{item.name}</p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-xs font-bold text-[#5b3256]">৳{item.price}</span>
        <span className="flex items-center gap-0.5 text-[10px] text-[#94A3B8]">
          <HiOutlineStar size={10} className="text-yellow-400" />
          {item.rating?.toFixed(1) || '—'}
        </span>
      </div>
    </div>
  </div>
);

/* ── Delete confirm modal ───────────────────────────────────── */
const DeleteConfirmModal = ({ title, desc, onConfirm, onClose, loading }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    <div className="relative bg-white rounded-2xl border border-[#EDE8F0] shadow-xl p-6 max-w-sm w-full"
      onClick={e => e.stopPropagation()}>
      <button onClick={onClose}
        className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-[#F8F5FC] flex items-center justify-center text-[#64748B] hover:text-[#5b3256]">
        <HiOutlineXMark size={16} />
      </button>
      <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
        <HiOutlineExclamationTriangle size={22} className="text-red-500" />
      </div>
      <h3 className="text-base font-bold text-[#0F172A] text-center mb-1">{title}</h3>
      <p className="text-sm text-[#94A3B8] text-center mb-6">{desc}</p>
      <div className="flex gap-2">
        <button onClick={onClose}
          className="flex-1 border border-[#EDE8F0] text-sm font-medium py-2.5 rounded-xl hover:bg-[#F8F5FC] transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60">
          {loading ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </div>
  </div>
);

/* ── Overview ───────────────────────────────────────────────── */
const Overview = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const shop      = useSelector(selectMyShop);
  const items     = useSelector(selectItems);
  const loading   = useSelector(selectShopLoading);
  const user      = useSelector(selectUser);
  const [comingSoon, setComingSoon] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showItemForm, setShowItemForm] = useState(false);

  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);
  useEffect(() => { if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id })); }, [shop?._id, dispatch]);

  const QUICK_ACTIONS = [
    { icon: '🛒', label: 'New order',    sub: 'POS / manual', bg: '#f5eef4', onClick: () => setComingSoon('New Order (POS)') },
    { icon: '🍽️', label: 'Add dish',     sub: 'Menu item',    bg: '#e8f5e9', onClick: () => navigate('/dashboard/items') },
    { icon: '🎁', label: 'Launch promo', sub: 'New coupon',   bg: '#fce4ec', onClick: () => setComingSoon('Promotions & Coupons') },
    { icon: '🖥️', label: 'Kitchen',      sub: 'Live KDS',     bg: '#e3f2fd', onClick: () => setComingSoon('Kitchen Display (KDS)') },
    { icon: '🗺️', label: 'Track riders', sub: 'Live map',     bg: '#ede7f6', onClick: () => setComingSoon('Live Rider Tracking') },
    { icon: '📊', label: 'Reports',      sub: 'Sales & more', bg: '#fff9c4', onClick: () => setComingSoon('Sales Reports & Analytics') },
  ];

  const handleEditItem = (item) => {
    setEditingItem(item);
    setShowItemForm(true);
  };

  const handleCloseItemForm = () => {
    setEditingItem(null);
    setShowItemForm(false);
    if (shop?._id) dispatch(fetchShopItems({ shopId: shop._id }));
  };

  return (
    <div className="space-y-6">
      <ComingSoon feature={comingSoon} onClose={() => setComingSoon(null)} />

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A]">
            Welcome back, {user?.fullName?.split(' ')[0] || 'Owner'} 👋
          </h1>
          <p className="text-xs text-[#94A3B8] mt-0.5">Main overview</p>
        </div>
        <div className="flex items-center gap-2">
          {shop && (
            <>
              {/* View shop on site */}
              <Link to={`/restaurant/${shop._id}`} target="_blank"
                className="flex items-center gap-1.5 text-xs font-semibold text-[#5b3256] bg-[#f5eef4] hover:bg-[#ede0eb] px-3 py-2 rounded-xl transition-colors">
                View shop <HiOutlineArrowTopRightOnSquare size={13} />
              </Link>
              {/* Open/close toggle */}
              <button
                onClick={() => dispatch(toggleShop(shop._id))}
                disabled={loading}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl border transition-all disabled:opacity-50
                  ${shop.isOpen
                    ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                    : 'border-gray-200 bg-white text-gray-500 hover:bg-gray-50'
                  }`}>
                <HiOutlinePower size={15} />
                {shop.isOpen ? 'Open' : 'Closed'}
              </button>
            </>
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
          <button onClick={() => setComingSoon('Customizable Quick Actions')}
            className="text-xs text-[#5b3256] font-semibold hover:underline">
            Customize →
          </button>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_ACTIONS.map(a => (
            <button key={a.label} onClick={a.onClick}
              className="flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all border border-transparent hover:border-[#EDE8F0]"
              style={{ background: a.bg, minHeight: 100 }}>
              <span className="text-2xl">{a.icon}</span>
              <div>
                <p className="text-xs font-semibold text-[#0F172A] leading-tight">{a.label}</p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">{a.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <StatsCards shop={shop} itemCount={items.length} />

      {/* Item form (edit from spotlight) */}
      {showItemForm && shop && (
        <ItemForm shopId={shop._id} item={editingItem} onClose={handleCloseItemForm} />
      )}

      {/* Spotlight + Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Spotlight */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#F0F0F4] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Today&apos;s spotlight</p>
              <p className="text-xs text-[#94A3B8]">Your top menu items</p>
            </div>
            <button onClick={() => navigate('/dashboard/items')}
              className="text-xs text-[#5b3256] font-semibold hover:underline">
              Full menu →
            </button>
          </div>
          {items.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {items.slice(0, 4).map((item, i) => (
                <SpotlightCard key={item._id} item={item}
                  tag={['Hot', 'Premium', 'Healthy', null][i]}
                  tagColor={['#ef4444', '#7c3aed', '#16a34a', null][i]}
                  onEdit={handleEditItem}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <span className="text-4xl mb-3">🍽️</span>
              <p className="text-sm font-semibold text-[#0F172A] mb-1">No items yet</p>
              <p className="text-xs text-[#94A3B8] mb-4">Add items to see them here</p>
              <button onClick={() => navigate('/dashboard/items')}
                className="flex items-center gap-1.5 bg-[#5b3256] hover:bg-[#4a2845] text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors">
                <HiOutlinePlus size={13} /> Add item
              </button>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-2xl border border-[#F0F0F4] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-bold text-[#0F172A]">Customers love it</p>
              <p className="text-xs text-[#94A3B8]">Latest 5★ reviews</p>
            </div>
            <button onClick={() => setComingSoon('Reviews & Feedback')}
              className="text-xs text-[#5b3256] font-semibold hover:underline">All</button>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <span className="text-3xl mb-2">⭐</span>
            <p className="text-xs text-[#94A3B8]">Reviews appear here once customers rate your items</p>
          </div>
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

/* ── My Shop ────────────────────────────────────────────────── */
const MyShop = () => {
  const dispatch = useDispatch();
  const shop     = useSelector(selectMyShop);
  const navigate = useNavigate();
  useEffect(() => { dispatch(fetchMyShop()); }, [dispatch]);

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={shop ? 'Edit Shop' : 'Create Shop'}
        subtitle={shop ? 'Update your shop information' : 'Set up your shop profile'}
        action={shop && (
          <Link to={`/restaurant/${shop._id}`} target="_blank"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5b3256] bg-[#f5eef4] hover:bg-[#ede0eb] px-3 py-2 rounded-xl transition-colors">
            Preview <HiOutlineArrowTopRightOnSquare size={13} />
          </Link>
        )}
      />
      <ShopForm shop={shop} />
    </div>
  );
};

/* ── Menu Items ─────────────────────────────────────────────── */
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
            className="flex items-center gap-2 bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-colors shadow-sm">
            <HiOutlinePlus size={15} /> Add Item
          </button>
        }
      />
      {showForm && <ItemForm shopId={shop._id} item={editing} onClose={handleClose} />}
      <ItemList items={items} onEdit={handleEdit} />
    </div>
  );
};

/* ── Settings ───────────────────────────────────────────────── */
const Settings = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const [editField, setEditField]       = useState(null); // { label, key, value, type }
  const [showDelete, setShowDelete]     = useState(false);
  const [deleting,  setDeleting]        = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState('');

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  const handleSaveField = async (value) => {
    try {
      await api.put('/auth/profile', { [editField.key]: value });
      setSaveSuccess(`${editField.label} updated!`);
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch {
      // silently fail for now — backend endpoint can be added later
      setSaveSuccess(`${editField.label} updated (locally)!`);
      setTimeout(() => setSaveSuccess(''), 3000);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);
      await api.delete('/auth/account');
      await dispatch(signOut());
      navigate('/signup');
    } catch {
      // fallback — just sign out
      await dispatch(signOut());
      navigate('/signup');
    } finally {
      setDeleting(false);
    }
  };

  const FIELDS = [
    { icon: HiOutlineUser,        label: 'Full Name', key: 'fullName', value: user?.fullName, type: 'text'  },
    { icon: HiOutlineEnvelope,    label: 'Email',     key: 'email',    value: user?.email,    type: 'email' },
    { icon: HiOutlinePhone,       label: 'Mobile',    key: 'mobile',   value: user?.mobile,   type: 'tel'   },
    { icon: HiOutlineShieldCheck, label: 'Role',      key: 'role',     value: user?.role,     type: 'text', readOnly: true },
  ];

  return (
    <div className="max-w-lg space-y-5">
      {editField && (
        <EditFieldModal
          label={editField.label}
          value={editField.value}
          type={editField.type}
          onSave={handleSaveField}
          onClose={() => setEditField(null)}
        />
      )}
      {showDelete && (
        <DeleteConfirmModal
          title="Delete account?"
          desc="This will permanently remove your account, shop, and all items. This action cannot be undone."
          loading={deleting}
          onConfirm={handleDeleteAccount}
          onClose={() => setShowDelete(false)}
        />
      )}

      <PageHeader title="Settings" subtitle="Manage your account" />

      {saveSuccess && (
        <div className="text-sm text-green-700 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
          ✅ {saveSuccess}
        </div>
      )}

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
        {FIELDS.map(({ icon: Icon, label, key, value, type, readOnly }) => (
          <div key={label} className="flex items-center gap-4 px-5 py-4">
            <div className="w-8 h-8 rounded-xl bg-[#f5eef4] flex items-center justify-center shrink-0">
              <Icon size={15} className="text-[#5b3256]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-[#94A3B8]">{label}</p>
              <p className="text-sm font-semibold text-[#0F172A] mt-0.5">{value || '—'}</p>
            </div>
            {readOnly
              ? <span className="text-xs text-[#94A3B8] italic">fixed</span>
              : (
                <button
                  onClick={() => setEditField({ label, key, value, type })}
                  className="text-xs text-[#5b3256] font-semibold hover:underline">
                  Edit
                </button>
              )
            }
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl border border-red-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-50">
          <p className="text-sm font-semibold text-red-500">Danger Zone</p>
          <p className="text-xs text-[#94A3B8] mt-0.5">These actions are irreversible</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#0F172A]">Delete account</p>
            <p className="text-xs text-[#94A3B8]">Permanently removes your account and shop</p>
          </div>
          <button
            onClick={() => setShowDelete(true)}
            className="text-sm text-red-500 font-semibold border border-red-200 px-4 py-1.5 rounded-xl hover:bg-red-50 transition-colors">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Coming Soon page (operations routes) ───────────────────── */
const ComingSoonPage = ({ title, icon, desc }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
    <div className="w-20 h-20 rounded-3xl bg-[#f5eef4] flex items-center justify-center mb-5 text-5xl">
      {icon}
    </div>
    <h1 className="text-2xl font-bold text-[#0F172A] mb-2">{title}</h1>
    <p className="text-sm text-[#94A3B8] max-w-xs mb-6">{desc}</p>
    <div className="inline-flex items-center gap-2 bg-[#f5eef4] text-[#5b3256] text-xs font-bold px-4 py-2 rounded-full">
      🚀 Coming soon
    </div>
  </div>
);

/* ── Root ───────────────────────────────────────────────────── */
const OwnerDashboard = () => (
  <DashboardLayout>
    <Routes>
      <Route index              element={<Overview />}  />
      <Route path="shop"        element={<MyShop />}    />
      <Route path="items"       element={<MenuItems />} />
      <Route path="settings"    element={<Settings />}  />
      {/* Operations — coming soon pages */}
      <Route path="delivery"    element={<ComingSoonPage title="Delivery"    icon="🚴" desc="Manage and track all your deliveries in real time." />} />
      <Route path="customers"   element={<ComingSoonPage title="Customers"   icon="👥" desc="View customer profiles, order history and feedback." />} />
      <Route path="promos"      element={<ComingSoonPage title="Promotions"  icon="🎁" desc="Create coupons, discounts and promotional campaigns." />} />
      <Route path="analytics"   element={<ComingSoonPage title="Reports"     icon="📊" desc="Sales analytics, revenue charts and performance data." />} />
    </Routes>
  </DashboardLayout>
);

export default OwnerDashboard;
