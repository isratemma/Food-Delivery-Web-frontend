import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineMapPin,
  HiOutlineMagnifyingGlass,
  HiOutlineShoppingCart,
} from 'react-icons/hi2';
import { signOut, selectUser, selectIsAuth } from '../store/slices/authSlice';

const Navbar = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const isAuth    = useSelector(selectIsAuth);

  const [location, setLocation] = useState('Dhaka');
  const [search, setSearch]     = useState('');

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/signin');
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
          <div className="flex items-center gap-1.5 px-3 border-r border-[#e8dde8] shrink-0">
            <HiOutlineMapPin size={16} className="text-[#5b3256]" />
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              className="w-20 sm:w-24 text-sm font-medium text-[#0F172A] bg-transparent outline-none py-2.5"
              placeholder="Location"
            />
          </div>

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
