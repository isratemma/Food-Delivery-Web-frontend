import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
} from 'react-icons/hi2';
import { signOut, selectUser, selectIsAuth } from '../store/slices/authSlice';

const GEOAPIFY_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

const Navbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const isAuth    = useSelector(selectIsAuth);

  const [location, setLocation]       = useState('Your location');
  const [search, setSearch]           = useState('');
  const [locLoading, setLocLoading]   = useState(false);
  const [locError, setLocError]       = useState('');

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/signin');
  };

  // Auto-detect city using browser GPS + Geoapify reverse geocoding
  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocError('Geolocation not supported');
      return;
    }
    setLocLoading(true);
    setLocError('');
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude: lat, longitude: lon } = coords;
          const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=${GEOAPIFY_KEY}`;
          const res  = await fetch(url);
          const data = await res.json();
          const result = data.results?.[0];
          const city =
            result?.city ||
            result?.county ||
            result?.state ||
            result?.country ||
            'Unknown location';
          setLocation(city);
        } catch {
          setLocError('Could not fetch location');
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        setLocError('Permission denied');
        setLocLoading(false);
      }
    );
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'A';

  return (
    <nav className="sticky top-0 z-50 bg-[#fff8f6] border-b border-[#f0e8e4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">

        {/* Logo */}
        <Link to="/" className="shrink-0">
          <span className="text-2xl font-extrabold text-[#5b3256] tracking-tight">VingoLink</span>
        </Link>

        {/* Location + Search bar */}
        <div className="flex flex-1 items-center bg-white border border-[#e8dde8] rounded-xl overflow-hidden mx-2 sm:mx-4">

          {/* Location */}
          <button
            type="button"
            onClick={detectLocation}
            title="Click to detect your location"
            className="flex items-center gap-1.5 px-3 border-r border-[#e8dde8] shrink-0 hover:bg-[#f5eef4] transition-colors h-full py-2.5"
          >
            {locLoading ? (
              <svg className="animate-spin h-4 w-4 text-[#5b3256]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <HiOutlineMapPin size={16} className="text-[#5b3256] shrink-0" />
            )}
            <span className="text-sm font-medium text-[#0F172A] max-w-[100px] truncate">
              {locError || location}
            </span>
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 flex-1 px-3">
            <HiOutlineMagnifyingGlass size={16} className="text-[#94A3B8] shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="search delicious food..."
              className="flex-1 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-transparent outline-none py-2.5"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">

          {/* Cart */}
          <Link to="/cart" className="relative p-1">
            <HiOutlineShoppingCart size={22} className="text-[#5b3256]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#5b3256] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              0
            </span>
          </Link>

          {/* My Orders */}
          <Link to="/orders"
            className="hidden sm:block text-sm font-semibold text-[#5b3256] hover:opacity-80 transition-opacity whitespace-nowrap">
            My Orders
          </Link>

          {/* Avatar */}
          {isAuth ? (
            <button
              onClick={handleSignOut}
              title={`${user?.fullName} — click to sign out`}
              className="w-9 h-9 rounded-full bg-[#5b3256] flex items-center justify-center text-white text-sm font-bold shrink-0 hover:bg-[#4a2845] transition-colors overflow-hidden"
            >
              {user?.avatar
                ? <img src={user.avatar} alt="" className="w-9 h-9 object-cover" />
                : initials
              }
            </button>
          ) : (
            <Link to="/signin"
              className="w-9 h-9 rounded-full bg-[#5b3256] flex items-center justify-center text-white text-sm font-bold shrink-0 hover:bg-[#4a2845] transition-colors">
              A
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
