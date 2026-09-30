import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlineSquares2X2,
  HiOutlineShoppingBag,
  HiOutlineClipboardDocumentList,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineBell,
  HiOutlineChevronDown,
} from 'react-icons/hi2';
import { signOut, selectUser } from '../../store/slices/authSlice';

const NAV = [
  { to: '/dashboard',          label: 'Overview',   icon: HiOutlineSquares2X2,         end: true },
  { to: '/dashboard/shop',     label: 'My Shop',    icon: HiOutlineShoppingBag,         end: false },
  { to: '/dashboard/items',    label: 'Menu Items', icon: HiOutlineClipboardDocumentList, end: false },
  { to: '/dashboard/settings', label: 'Settings',   icon: HiOutlineCog6Tooth,           end: false },
];

const DashboardLayout = ({ children }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu,   setUserMenu]   = useState(false);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/signin');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo row */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/10 shrink-0">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M3 21H21M3 18H21M6 18V9M10 18V9M14 18V9M18 18V9M2 9L12 3L22 9"
                stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-bold text-white text-base tracking-tight">VingoLink</span>
        </Link>
        {mobile && (
          <button onClick={() => setMobileOpen(false)} className="text-white/60 hover:text-white">
            <HiOutlineXMark size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-3">
          Main Menu
        </p>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => mobile && setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
               ${isActive
                 ? 'bg-white/15 text-white shadow-sm'
                 : 'text-white/55 hover:text-white hover:bg-white/8'
               }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
                  ${isActive ? 'bg-white/20' : 'bg-transparent'}`}>
                  <Icon size={16} />
                </div>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/8 transition-colors cursor-pointer"
          onClick={() => setUserMenu(v => !v)}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
            {user?.avatar
              ? <img src={user.avatar} alt="" className="w-8 h-8 object-cover" />
              : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user?.fullName}</p>
            <p className="text-[11px] text-white/45 truncate">Owner</p>
          </div>
          <HiOutlineChevronDown size={14} className="text-white/40 shrink-0" />
        </div>
        {userMenu && (
          <div className="mt-1 mx-2">
            <button onClick={handleSignOut}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
              <HiOutlineArrowRightOnRectangle size={15} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: '#F0EDF3' }}>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-56 h-full shrink-0"
        style={{ background: 'linear-gradient(180deg, #3d1f3a 0%, #5b3256 60%, #7a4472 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <aside
            className="w-60 h-full shadow-2xl"
            style={{ background: 'linear-gradient(180deg, #3d1f3a 0%, #5b3256 60%, #7a4472 100%)' }}
          >
            <SidebarContent mobile />
          </aside>
          <div className="flex-1 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 h-14 bg-white border-b border-[#EDE8F0] flex items-center justify-between px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-[#64748B] hover:text-[#5b3256] transition-colors"
              onClick={() => setMobileOpen(true)}>
              <HiOutlineBars3 size={22} />
            </button>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-[#0F172A]">Owner Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification bell */}
            <button className="relative w-9 h-9 rounded-xl bg-[#F8F5FC] flex items-center justify-center text-[#64748B] hover:text-[#5b3256] hover:bg-[#F0EDF3] transition-colors">
              <HiOutlineBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5b3256] rounded-full" />
            </button>

            {/* Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#5b3256] flex items-center justify-center text-white text-xs font-bold">
                {user?.avatar
                  ? <img src={user.avatar} alt="" className="w-8 h-8 object-cover" />
                  : initials}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-[#0F172A] leading-tight">{user?.fullName?.split(' ')[0]}</p>
                <p className="text-[10px] text-[#94A3B8]">Owner</p>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto px-5 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
