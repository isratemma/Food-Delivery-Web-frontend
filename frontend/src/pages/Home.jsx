import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  HiOutlineClock,
  HiOutlineStar,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineFire,
  HiArrowRight,
} from 'react-icons/hi2';
import Navbar from '../components/Navbar';
import { selectUser, selectIsAuth } from '../store/slices/authSlice';
import { fetchAllShops, selectShops, selectShopLoading } from '../store/slices/shopSlice';

/* ── Categories ─────────────────────────────────────────── */
const CATEGORIES = [
  { id: 1, name: 'Burger',   emoji: '🍔' },
  { id: 2, name: 'Pizza',    emoji: '🍕' },
  { id: 3, name: 'Sushi',    emoji: '🍱' },
  { id: 4, name: 'Chicken',  emoji: '🍗' },
  { id: 5, name: 'Noodles',  emoji: '🍜' },
  { id: 6, name: 'Desserts', emoji: '🍰' },
  { id: 7, name: 'Drinks',   emoji: '🧃' },
  { id: 8, name: 'Salad',    emoji: '🥗' },
];

const HOW_IT_WORKS = [
  { icon: HiOutlineTruck,       title: 'Choose a restaurant', desc: 'Browse restaurants near your location.' },
  { icon: HiOutlineFire,        title: 'Pick your meal',      desc: 'Select from a wide variety of fresh food.' },
  { icon: HiOutlineShieldCheck, title: 'Fast delivery',       desc: 'Your food arrives hot right at your door.' },
];

/* ── Tag badge ───────────────────────────────────────────── */
const Tag = ({ label }) => {
  const map = {
    Popular:    'bg-[#f5eef4] text-[#5b3256]',
    New:        'bg-green-50 text-green-600',
    'Top Rated':'bg-blue-50 text-blue-600',
    Trending:   'bg-violet-50 text-violet-600',
  };
  return (
    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${map[label] || 'bg-gray-100 text-gray-500'}`}>
      {label}
    </span>
  );
};

/* ── Shop card (real data) ───────────────────────────────── */
const ShopCard = ({ shop, index }) => {
  const tags    = ['Popular', 'New', 'Top Rated', 'Trending'];
  const tag     = tags[index % tags.length];
  const bgColors = ['#f5eef4', '#f0fff4', '#f0f8ff', '#fdf0ff', '#fff8f0', '#f0fdf4'];
  const bg      = bgColors[index % bgColors.length];

  return (
    <Link to={`/restaurant/${shop._id}`}
      className="bg-white rounded-2xl border border-[#f0e8e4] overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="h-40 overflow-hidden relative" style={{ backgroundColor: bg }}>
        {shop.image
          ? <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-6xl">🍽️</div>
        }
        {/* Open/closed badge */}
        <span className={`absolute top-3 left-3 text-[10px] font-bold px-2 py-0.5 rounded-full
          ${shop.isOpen ? 'bg-green-500 text-white' : 'bg-gray-400 text-white'}`}>
          {shop.isOpen ? 'Open' : 'Closed'}
        </span>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-[#0F172A] group-hover:text-[#5b3256] transition-colors truncate max-w-[140px]">
            {shop.name}
          </h3>
          <Tag label={tag} />
        </div>
        <p className="text-xs text-[#64748B] mb-3">
          {shop.cuisine || shop.category}
          {shop.address?.city ? ` · ${shop.address.city}` : ''}
        </p>
        <div className="flex items-center gap-4 text-xs text-[#64748B]">
          <span className="flex items-center gap-1">
            <HiOutlineStar size={13} className="text-yellow-400" />
            {shop.rating?.toFixed(1) || '—'}
          </span>
          <span className="flex items-center gap-1">
            <HiOutlineClock size={13} />
            {shop.openingHours?.open ?? '—'} – {shop.openingHours?.close ?? '—'}
          </span>
          <span className={shop.deliveryFee === 0 ? 'text-green-600 font-medium' : ''}>
            {shop.deliveryFee === 0 ? 'Free delivery' : `৳${shop.deliveryFee}`}
          </span>
        </div>
      </div>
    </Link>
  );
};

/* ── Skeleton card ───────────────────────────────────────── */
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-[#f0e8e4] overflow-hidden animate-pulse">
    <div className="h-40 bg-gray-100" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-100 rounded w-3/4" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
      <div className="h-3 bg-gray-100 rounded w-2/3" />
    </div>
  </div>
);

/* ── Main ────────────────────────────────────────────────── */
const Home = () => {
  const dispatch  = useDispatch();
  const isAuth    = useSelector(selectIsAuth);
  const user      = useSelector(selectUser);
  const shops     = useSelector(selectShops);
  const loading   = useSelector(selectShopLoading);

  useEffect(() => {
    dispatch(fetchAllShops({ limit: 12 }));
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-[#fff8f6]">
      <Navbar />

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-10">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#f5eef4] text-[#5b3256] text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              <HiOutlineFire size={14} />
              <span>Free delivery on your first order</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight mb-4">
              Delicious food,<br />
              <span className="text-[#5b3256]">delivered fast.</span>
            </h1>
            <p className="text-[#64748B] text-base sm:text-lg mb-8 max-w-md mx-auto lg:mx-0">
              Order from the best local restaurants and get it delivered to your door in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to={isAuth ? '/restaurants' : '/signup'}
                className="bg-[#5b3256] hover:bg-[#4a2845] text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                {isAuth ? `Order now, ${user?.fullName?.split(' ')[0]}` : 'Order now'}
              </Link>
              <Link to="/restaurants"
                className="flex items-center justify-center gap-2 border border-[#e2d6e0] bg-white text-[#5b3256] font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#f5eef4] transition-colors">
                Browse restaurants <HiArrowRight size={15} />
              </Link>
            </div>
            <div className="flex gap-8 mt-10 justify-center lg:justify-start">
              {[
                { value: `${shops.length || '0'}+`, label: 'Restaurants' },
                { value: '50K+',   label: 'Happy customers' },
                { value: '30 min', label: 'Avg. delivery'   },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-[#0F172A]">{s.value}</p>
                  <p className="text-xs text-[#64748B]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex-1 flex justify-center">
            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <div className="absolute inset-0 rounded-full bg-[#f5eef4]" />
              <div className="absolute inset-0 flex items-center justify-center text-8xl">🍔</div>
              <div className="absolute -top-2 -right-4 bg-white rounded-2xl shadow-md px-3 py-2 flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">4.9 Rating</p>
                  <p className="text-[10px] text-[#64748B]">2.4k reviews</p>
                </div>
              </div>
              <div className="absolute -bottom-2 -left-4 bg-white rounded-2xl shadow-md px-3 py-2 flex items-center gap-2">
                <span className="text-xl">🚴</span>
                <div>
                  <p className="text-xs font-bold text-[#0F172A]">20 min</p>
                  <p className="text-[10px] text-[#64748B]">Delivery time</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">What are you craving?</h2>
          <Link to="/restaurants" className="text-sm text-[#5b3256] font-medium hover:underline flex items-center gap-1">
            See all <HiArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
          {CATEGORIES.map(cat => (
            <button key={cat.id}
              className="flex flex-col items-center gap-2 bg-white border border-[#f0e8e4] rounded-2xl py-4 hover:border-[#5b3256] hover:bg-[#f5eef4] transition-all group">
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-medium text-[#64748B] group-hover:text-[#5b3256]">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Restaurants (real data) ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#0F172A]">
            {shops.length > 0 ? 'Popular near you' : 'Restaurants'}
          </h2>
          <Link to="/restaurants" className="text-sm text-[#5b3256] font-medium hover:underline flex items-center gap-1">
            See all <HiArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : shops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shops.map((shop, i) => <ShopCard key={shop._id} shop={shop} index={i} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-6xl mb-4">🏪</span>
            <p className="text-lg font-semibold text-[#0F172A] mb-2">No restaurants yet</p>
            <p className="text-sm text-[#64748B] mb-6">Be the first to list your restaurant on VingoLink</p>
            <Link to="/signup"
              className="bg-[#5b3256] hover:bg-[#4a2845] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors">
              Join as an owner
            </Link>
          </div>
        )}
      </section>

      {/* ── How it works ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-[#0F172A] text-center mb-10">How VingoLink works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#f5eef4] flex items-center justify-center">
                <step.icon size={26} className="text-[#5b3256]" />
              </div>
              <div>
                <p className="font-semibold text-[#0F172A] mb-1">{step.title}</p>
                <p className="text-sm text-[#64748B]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      {!isAuth && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="bg-[#5b3256] rounded-3xl px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Ready to order?</h3>
              <p className="text-[#d4b5cc] text-sm">Sign up and get free delivery on your first order.</p>
            </div>
            <Link to="/signup"
              className="bg-white text-[#5b3256] font-bold px-6 py-3 rounded-xl hover:bg-[#f5eef4] transition-colors text-sm whitespace-nowrap">
              Get started — it&apos;s free
            </Link>
          </div>
        </section>
      )}

      {/* ── Footer ── */}
      <footer className="border-t border-[#f0e8e4] mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-xl font-extrabold text-[#5b3256]">VingoLink</span>
          <p className="text-sm text-[#94A3B8]">© 2026 VingoLink. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Contact'].map(l => (
              <Link key={l} to="#" className="text-sm text-[#64748B] hover:text-[#5b3256] transition-colors">{l}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
