import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineArrowLeft,
  HiOutlineStar,
  HiOutlineClock,
  HiOutlineTruck,
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineShoppingCart,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';
import { fetchShopById, selectCurrentShop, selectShopLoading } from '../store/slices/shopSlice';
import { fetchShopItems, selectItems, selectItemLoading } from '../store/slices/itemSlice';
import Navbar from '../components/Navbar';

/* ── Cart helpers (local state for now) ─────────────────── */
const useCart = () => {
  const [cart, setCart] = useState({});

  const add = (item) =>
    setCart(p => ({ ...p, [item._id]: { ...item, qty: (p[item._id]?.qty || 0) + 1 } }));

  const remove = (id) =>
    setCart(p => {
      const qty = (p[id]?.qty || 0) - 1;
      if (qty <= 0) { const next = { ...p }; delete next[id]; return next; }
      return { ...p, [id]: { ...p[id], qty } };
    });

  const qty   = (id) => cart[id]?.qty || 0;
  const total = Object.values(cart).reduce((s, i) => s + i.price * i.qty, 0);
  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);

  return { cart, add, remove, qty, total, count };
};

/* ── Badge ──────────────────────────────────────────────── */
const Badge = ({ label, color = '#5b3256', bg = '#f5eef4' }) => (
  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
    style={{ color, backgroundColor: bg }}>
    {label}
  </span>
);

/* ── Item Card ──────────────────────────────────────────── */
const ItemCard = ({ item, qty, onAdd, onRemove }) => (
  <div className="flex gap-4 bg-white border border-[#F0E8E4] rounded-2xl p-4 hover:shadow-sm transition-shadow">
    {/* Image */}
    <div className="w-20 h-20 rounded-xl overflow-hidden bg-[#F8FAFC] shrink-0">
      {item.image
        ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        : <div className="w-full h-full flex items-center justify-center text-3xl">🍽️</div>
      }
    </div>

    {/* Info */}
    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-[#0F172A]">{item.name}</p>
            {item.isVeg && <Badge label="VEG" color="#16a34a" bg="#f0fdf4" />}
          </div>
          {item.description && (
            <p className="text-xs text-[#94A3B8] mt-0.5 line-clamp-2">{item.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-sm font-bold text-[#5b3256]">৳{item.price}</span>
            {item.discountPrice && (
              <span className="text-xs text-[#94A3B8] line-through">৳{item.discountPrice}</span>
            )}
            <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
              <HiOutlineClock size={11} />{item.preparationTime}m
            </span>
          </div>
        </div>

        {/* Add / Remove */}
        {item.isAvailable ? (
          qty > 0 ? (
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={onRemove}
                className="w-7 h-7 rounded-lg bg-[#f5eef4] text-[#5b3256] flex items-center justify-center hover:bg-[#e8d5e5] transition-colors">
                <HiOutlineMinus size={13} />
              </button>
              <span className="text-sm font-bold text-[#0F172A] min-w-[16px] text-center">{qty}</span>
              <button onClick={onAdd}
                className="w-7 h-7 rounded-lg bg-[#5b3256] text-white flex items-center justify-center hover:bg-[#4a2845] transition-colors">
                <HiOutlinePlus size={13} />
              </button>
            </div>
          ) : (
            <button onClick={onAdd}
              className="shrink-0 flex items-center gap-1.5 bg-[#5b3256] hover:bg-[#4a2845] text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors">
              <HiOutlinePlus size={13} /> Add
            </button>
          )
        ) : (
          <span className="text-xs text-[#94A3B8] font-medium shrink-0">Unavailable</span>
        )}
      </div>
    </div>
  </div>
);

/* ── Cart Summary Bar ───────────────────────────────────── */
const CartBar = ({ count, total, onView }) => {
  if (count === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <button onClick={onView}
        className="w-full flex items-center justify-between bg-[#5b3256] hover:bg-[#4a2845] text-white px-5 py-4 rounded-2xl shadow-xl transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-sm font-bold">
            {count}
          </div>
          <span className="text-sm font-semibold">View Cart</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold">৳{total}</span>
          <HiOutlineShoppingCart size={18} />
        </div>
      </button>
    </div>
  );
};

/* ── Main Page ──────────────────────────────────────────── */
const FoodPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const dispatch  = useDispatch();

  const shop      = useSelector(selectCurrentShop);
  const items     = useSelector(selectItems);
  const shopLoad  = useSelector(selectShopLoading);
  const itemLoad  = useSelector(selectItemLoading);

  const { add, remove, qty, total, count } = useCart();
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    dispatch(fetchShopById(id));
    dispatch(fetchShopItems({ shopId: id }));
  }, [id, dispatch]);

  // Set first category as active
  const categories = [...new Set(items.map(i => i.category || 'Other'))];
  useEffect(() => {
    if (categories.length && !activeTab) setActiveTab(categories[0]);
  }, [categories, activeTab]);

  const loading = shopLoad || itemLoad;

  if (loading && !shop) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center">
          <svg className="animate-spin h-7 w-7 text-[#5b3256]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </div>
      </>
    );
  }

  if (!shop && !loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
          <span className="text-5xl">🍽️</span>
          <p className="font-semibold text-[#0F172A]">Restaurant not found</p>
          <button onClick={() => navigate(-1)} className="text-sm text-[#5b3256] hover:underline">Go back</button>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <Navbar />

      {/* Hero banner */}
      <div className="relative h-52 sm:h-64 bg-[#f5eef4] overflow-hidden">
        {shop?.image
          ? <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          : (
            <div className="w-full h-full flex items-center justify-center text-8xl opacity-20">🍽️</div>
          )
        }
        {/* Back button */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#0F172A] hover:bg-white transition-colors shadow">
          <HiOutlineArrowLeft size={17} />
        </button>
        {/* Open/closed badge */}
        <div className="absolute top-4 right-4">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${shop?.isOpen ? 'bg-green-500 text-white' : 'bg-[#94A3B8] text-white'}`}>
            {shop?.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Shop info card */}
        <div className="bg-white rounded-2xl border border-[#F0E8E4] -mt-8 relative z-10 p-5 mb-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-[#0F172A]">{shop?.name}</h1>
              <p className="text-sm text-[#64748B] mt-0.5">{shop?.cuisine || shop?.category}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0 bg-yellow-50 border border-yellow-100 px-2.5 py-1 rounded-xl">
              <HiOutlineStar size={14} className="text-yellow-500" />
              <span className="text-sm font-bold text-[#0F172A]">{shop?.rating?.toFixed(1) || '—'}</span>
              {shop?.totalRatings > 0 && (
                <span className="text-xs text-[#94A3B8]">({shop.totalRatings})</span>
              )}
            </div>
          </div>

          {shop?.description && (
            <p className="text-sm text-[#64748B] mt-2">{shop.description}</p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap gap-4 mt-4 text-xs text-[#64748B]">
            {shop?.openingHours && (
              <span className="flex items-center gap-1.5">
                <HiOutlineClock size={13} className="text-[#5b3256]" />
                {shop.openingHours.open} – {shop.openingHours.close}
              </span>
            )}
            {shop?.address?.city && (
              <span className="flex items-center gap-1.5">
                <HiOutlineMapPin size={13} className="text-[#5b3256]" />
                {shop.address.city}{shop.address.country ? `, ${shop.address.country}` : ''}
              </span>
            )}
            {shop?.phone && (
              <span className="flex items-center gap-1.5">
                <HiOutlinePhone size={13} className="text-[#5b3256]" />
                {shop.phone}
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <HiOutlineTruck size={13} className="text-[#5b3256]" />
              {shop?.deliveryFee === 0 ? 'Free delivery' : `৳${shop?.deliveryFee} delivery`}
            </span>
            {shop?.minOrder > 0 && (
              <span className="text-[#94A3B8]">Min order ৳{shop.minOrder}</span>
            )}
          </div>
        </div>

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveTab(cat)}
                className={`shrink-0 text-sm font-medium px-4 py-2 rounded-xl border transition-colors
                  ${activeTab === cat
                    ? 'bg-[#5b3256] text-white border-[#5b3256]'
                    : 'bg-white text-[#64748B] border-[#E4E4E4] hover:border-[#5b3256] hover:text-[#5b3256]'
                  }`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Items */}
        {items.length === 0 && !itemLoad ? (
          <div className="flex flex-col items-center py-20 text-center">
            <span className="text-5xl mb-3">🍽️</span>
            <p className="font-semibold text-[#0F172A]">No items on the menu yet</p>
            <p className="text-sm text-[#64748B] mt-1">Check back soon</p>
          </div>
        ) : (
          <div className="space-y-6 pb-32">
            {(categories.length > 1 ? [activeTab] : categories).map(cat => {
              const catItems = items.filter(i => (i.category || 'Other') === cat);
              if (!catItems.length) return null;
              return (
                <div key={cat}>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3">{cat}</p>
                  <div className="space-y-3">
                    {catItems.map(item => (
                      <ItemCard
                        key={item._id}
                        item={item}
                        qty={qty(item._id)}
                        onAdd={() => add(item)}
                        onRemove={() => remove(item._id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating cart bar */}
      <CartBar count={count} total={total} onView={() => navigate('/cart')} />
    </div>
  );
};

export default FoodPage;
