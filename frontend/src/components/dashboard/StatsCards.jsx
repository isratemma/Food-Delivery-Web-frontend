import React from 'react';
import {
  HiOutlineShoppingBag,
  HiOutlineClipboardDocumentList,
  HiOutlineStar,
  HiOutlineTruck,
} from 'react-icons/hi2';

const CARDS = (shop, itemCount) => [
  {
    label:   'Shop Status',
    value:   shop?.isOpen ? 'Open' : shop ? 'Closed' : '—',
    sub:     shop?.name   || 'No shop yet',
    icon:    HiOutlineShoppingBag,
    grad:    shop?.isOpen
               ? 'linear-gradient(135deg,#22C55E,#16A34A)'
               : 'linear-gradient(135deg,#94A3B8,#64748B)',
    dot:     shop?.isOpen ? '#22C55E' : '#94A3B8',
    dotLabel: shop?.isOpen ? 'Live' : 'Offline',
  },
  {
    label:   'Menu Items',
    value:   itemCount ?? 0,
    sub:     'Items on your menu',
    icon:    HiOutlineClipboardDocumentList,
    grad:    'linear-gradient(135deg,#5b3256,#7a4472)',
    dot:     '#5b3256',
    dotLabel:'Total',
  },
  {
    label:   'Rating',
    value:   shop?.rating ? shop.rating.toFixed(1) : '—',
    sub:     shop?.totalRatings ? `${shop.totalRatings} reviews` : 'No reviews yet',
    icon:    HiOutlineStar,
    grad:    'linear-gradient(135deg,#F59E0B,#D97706)',
    dot:     '#F59E0B',
    dotLabel:'Avg',
  },
  {
    label:   'Delivery Fee',
    value:   shop?.deliveryFee === 0 ? 'Free' : shop?.deliveryFee != null ? `৳${shop.deliveryFee}` : '—',
    sub:     shop?.minOrder ? `Min order ৳${shop.minOrder}` : 'No minimum',
    icon:    HiOutlineTruck,
    grad:    'linear-gradient(135deg,#3B82F6,#2563EB)',
    dot:     '#3B82F6',
    dotLabel:'Fee',
  },
];

const StatsCards = ({ shop, itemCount }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {CARDS(shop, itemCount).map(({ label, value, sub, icon: Icon, grad, dot, dotLabel }) => (
      <div key={label}
        className="bg-white rounded-2xl p-5 border border-[#EDE8F0] hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: grad }}>
            <Icon size={19} className="text-white" />
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: dot + '18', color: dot }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: dot }} />
            {dotLabel}
          </span>
        </div>
        <p className="text-2xl font-bold text-[#0F172A] leading-none mb-1">{value}</p>
        <p className="text-xs font-medium text-[#64748B] mb-0.5">{label}</p>
        <p className="text-[11px] text-[#94A3B8] truncate">{sub}</p>
      </div>
    ))}
  </div>
);

export default StatsCards;
