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
  HiOutlineChevronRight,
  HiOutlineTruck,
  HiOutlineUsers,
  HiOutlineChartBar,
  HiOutlineMegaphone,
  HiOutlinePlus,
} from 'react-icons/hi2';
import { signOut, selectUser } from '../../store/slices/authSlice';

const MAIN_NAV = [
  { to: '/dashboard',          label: 'Dashboard',       icon: HiOutlineSquares2X2,           end: true  },
  { to: '/dashboard/items',    label: 'Menu Management', icon: HiOutlineClipboardDocumentList, end: false },
  { to: '/dashboard/shop',     label: 'My Shop',         icon: HiOutlineShoppingBag,           end: false },
];

const OPS_NAV = [
  { to: '/dashboard/delivery',  label: 'Delivery',    icon: HiOutlineTruck     },
  { to: '/dashboard/customers', label: 'Customers',   icon: HiOutlineUsers     },
  { to: '/dashboard/promos',    label: 'Promotions',  icon: HiOutlineMegaphone },
  { to: '/dashboard/analytics', label: 'Reports',     icon: HiOutlineChartBar  },
];

const ACCOUNT_NAV = [
  { to: '/dashboard/settings', label: 'Settings', icon: HiOutlineCog6Tooth },
];

const NavItem = ({ to, label, icon: Icon, end = false, badge, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center justify-between px-3 py-2 rounded-xl text-[13px] font-medium transition-all
       ${isActive ? 'bg-white/20 text-white' : 'text-white/65 hover:text-white hover:bg-white/10'}`
    }
  >
    {({ isActive }) => (
      <>
        <span className="flex items-center gap-3">
          <Icon size={16} className={isActive ? 'text-white' : 'text-white/60'} />
          {label}
        </span>
        <span className="flex items-center gap-1.5">
          {badge && (
            <span className="bg-white text-orange-500 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
              {badge}
            </span>
          )}
          <HiOutlineChevronRight size={12} className={isActive ? 'text-white/60' : 'text-white/30'} />
        </span>
      </>
    )}
  </NavLink>
);

const NavGroup = ({ label, children }) => (
  <div className="mb-1">
    <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 px-3 mb-2 mt-5">{label}</p>
    <div className="space-y-0.5">{children}</div>
  </div>
);

const DashboardLayout = ({ children }) => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const user      = useSelector(selectUser);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await dispatch(signOut());
    navigate('/signin');
  };

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'OW';

  const close = () => setMobileOpen(false);

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 shrink-0">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M3 21H21M3 18H21M6 18V9M10 18V9M14 18V9M18 18V9M2 9L12 3L22 9"
                stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-extrabold text-white text-[15px] tracking-tight">VingoLink</span>
        </Link>
        {mobile && (
          <button onClick={close} className="text-white/60 hover:text-white">
            <HiOutlineXMark size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto px-3 pb-4">
        <NavGroup label="Main">
          {MAIN_NAV.map(n => <NavItem key={n.to} {...n} onClick={mobile ? close : undefined} />)}
        </NavGroup>
        <NavGroup label="Operations">
          {OPS_NAV.map(n => <NavItem key={n.to} {...n} onClick={mobile ? close : undefined} />)}
        </NavGroup>
        <NavGroup label="Account">
          {ACCOUNT_NAV.map(n => <NavItem key={n.to} {...n} onClick={mobile ? close : undefined} />)}
        </NavGroup>
      </div>

      {/* User row */}
      <div className="px-4 py-4 border-t border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0">
            {user?.avatar ? <img src={user.avatar} alt="" className="w-8 h-8 object-cover" /> : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">{user?.fullName}</p>
            <p className="text-[11px] text-white/45 truncate">Owner</p>
          </div>
          <button onClick={handleSignOut} title="Sign out"
            className="text-white/40 hover:text-white transition-colors">
            <HiOutlineArrowRightOnRectangle size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F6FA]">

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col w-52 h-full shrink-0"
        style={{ background: 'linear-gradient(160deg,#c75000 0%,#e8650a 40%,#f58020 100%)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <aside className="w-56 h-full shadow-2xl"
            style={{ background: 'linear-gradient(160deg,#c75000 0%,#e8650a 40%,#f58020 100%)' }}>
            <SidebarContent mobile />
          </aside>
          <div className="flex-1 bg-black/40" onClick={close} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <header className="shrink-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-5 sm:px-6 gap-4">
          <button className="md:hidden text-gray-500" onClick={() => setMobileOpen(true)}>
            <HiOutlineBars3 size={22} />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-[#F5F6FA] rounded-xl px-4 py-2 w-56">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <span className="text-sm text-gray-400">Search…</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button className="hidden sm:flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors shadow-sm shadow-orange-200">
              <HiOutlinePlus size={14} /> New order
            </button>
            <button className="relative w-9 h-9 rounded-xl bg-[#F5F6FA] flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors">
              <HiOutlineBell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {user?.avatar ? <img src={user.avatar} alt="" className="w-8 h-8 object-cover" /> : initials}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-5 sm:px-6 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
