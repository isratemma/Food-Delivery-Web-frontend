import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineUser,
} from 'react-icons/hi2';
import { signOut, selectUser } from '../../store/slices/authSlice';

const NAV = [
  { to: '/dashboard',       label: 'Overview',  icon: HiOutlineSquares2X2 },
  { to: '/dashboard/shop',  label: 'My Shop',   icon: HiOutlineShoppingBag },
  { to: '/dashboard/items', label: 'Menu Items', icon: HiOutlineClipboardDocumentList },
  { to: '/dashboard/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

const DashboardLayout = ({ children }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const [open, setOpen] = useState(false);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/signin');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      flex flex-col h-full bg-white border-r border-[#F0E8E4]
      ${mobile ? 'w-full' : 'w-60'}
    `}>
      {/* Brand */}
      <div className="flex items-center justify-between px-5 py-5 border-b border-[#F0E8E4]">
        <NavLink to="/" className="text-xl font-extrabold text-[#5b3256]">VingoLink</NavLink>
        {mobile && (
          <button onClick={() => setOpen(false)} className="text-[#64748B]">
            <HiOutlineXMark size={22} />
          </button>
        )}
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            onClick={() => mobile && setOpen(false)}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
              ${isActive
                ? 'bg-[#f5eef4] text-[#5b3256]'
                : 'text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
              }
            `}
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User + sign out */}
      <div className="px-4 py-4 border-t border-[#F0E8E4]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-[#5b3256] flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-9 h-9 object-cover" />
              : initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-[#0F172A] truncate">{user?.fullName}</p>
            <p className="text-xs text-[#94A3B8] truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-sm text-[#64748B] hover:text-[#5b3256] transition-colors w-full px-1"
        >
          <HiOutlineArrowRightOnRectangle size={16} />
          Sign out
        </button>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col h-full">
        <Sidebar />
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="w-64 h-full shadow-xl">
            <Sidebar mobile />
          </div>
          <div className="flex-1 bg-black/40" onClick={() => setOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="bg-white border-b border-[#F0E8E4] px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
          <button className="md:hidden text-[#64748B]" onClick={() => setOpen(true)}>
            <HiOutlineBars3 size={22} />
          </button>
          <p className="text-sm font-semibold text-[#0F172A] hidden md:block">Owner Dashboard</p>
          <div className="flex items-center gap-2 ml-auto">
            <div className="w-8 h-8 rounded-full bg-[#f5eef4] flex items-center justify-center">
              <HiOutlineUser size={15} className="text-[#5b3256]" />
            </div>
            <span className="text-sm font-medium text-[#0F172A] hidden sm:block">
              {user?.fullName?.split(' ')[0]}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
