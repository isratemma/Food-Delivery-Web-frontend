import React from 'react';
import {
  HiOutlineShoppingBag,
  HiOutlineClipboardDocumentList,
  HiOutlineStar,
  HiOutlineCheckCircle,
} from 'react-icons/hi2';

const Card = ({ icon: Icon, label, value, sub, color }) => (
  <div className="bg-white rounded-2xl border border-[#F0E8E4] px-5 py-5">
    <div className="flex items-center justify-between mb-3">
      <p className="text-sm text-[#64748B] font-medium">{label}</p>
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-bold text-[#0F172A]">{value}</p>
    {sub && <p className="text-xs text-[#94A3B8] mt-1">{sub}</p>}
  </div>
);

const StatsCards = ({ shop, itemCount }) => {
  const stats = [
    {
      icon:  HiOutlineShoppingBag,
      label: 'Shop Status',
      value: shop?.isOpen ? 'Open' : 'Closed',
      sub:   shop?.name || 'No shop yet',
      color: shop?.isOpen ? '#22C55E' : '#EF4444',
    },
    {
      icon:  HiOutlineClipboardDocumentList,
      label: 'Menu Items',
      value: itemCount ?? 0,
      sub:   'Total items in menu',
      color: '#5b3256',
    },
    {
      icon:  HiOutlineStar,
      label: 'Rating',
      value: shop?.rating ? shop.rating.toFixed(1) : '—',
      sub:   shop?.totalRatings ? `${shop.totalRatings} reviews` : 'No reviews yet',
      color: '#F59E0B',
    },
    {
      icon:  HiOutlineCheckCircle,
      label: 'Delivery Fee',
      value: shop?.deliveryFee === 0 ? 'Free' : `৳${shop?.deliveryFee ?? '—'}`,
      sub:   shop?.minOrder ? `Min order ৳${shop.minOrder}` : 'No minimum order',
      color: '#3B82F6',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => <Card key={s.label} {...s} />)}
    </div>
  );
};

export default StatsCards;
