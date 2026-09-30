import React from 'react';

const CARDS = (shop, itemCount) => [
  {
    label:   "TODAY'S REVENUE",
    value:   shop ? `৳${(itemCount * 320).toLocaleString()}` : '৳0',
    trend:   '+18.3%',
    trendUp: true,
    sub:     'vs yesterday',
    bg:      'linear-gradient(135deg,#f58020 0%,#e8650a 100%)',
    iconBg:  'rgba(255,255,255,0.2)',
    icon:    '৳',
    textColor: 'white',
  },
  {
    label:   'ORDERS TODAY',
    value:   itemCount > 0 ? String(itemCount * 12) : '0',
    trend:   '+12.4%',
    trendUp: true,
    sub:     'vs yesterday',
    bg:      '#ffffff',
    iconBg:  '#e8f5e9',
    icon:    '🛒',
    textColor: '#0F172A',
  },
  {
    label:   'NEW CUSTOMERS',
    value:   itemCount > 0 ? String(itemCount * 3) : '0',
    trend:   '+6.8%',
    trendUp: true,
    sub:     'vs yesterday',
    bg:      '#ffffff',
    iconBg:  '#e3f2fd',
    icon:    '👥',
    textColor: '#0F172A',
  },
  {
    label:   'AVG PREP TIME',
    value:   shop ? '18 min' : '—',
    trend:   '-2.1 min',
    trendUp: true,
    sub:     'faster than avg',
    bg:      '#ffffff',
    iconBg:  '#fff3e0',
    icon:    '⏱',
    textColor: '#0F172A',
  },
];

const StatsCards = ({ shop, itemCount }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
    {CARDS(shop, itemCount).map(({ label, value, trend, trendUp, sub, bg, iconBg, icon, textColor }) => (
      <div key={label} className="rounded-2xl p-5 shadow-sm"
        style={{ background: bg, border: bg === '#ffffff' ? '1px solid #F0F0F4' : 'none' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: iconBg }}>
            {icon}
          </div>
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-1"
          style={{ color: bg === '#ffffff' ? '#94A3B8' : 'rgba(255,255,255,0.7)' }}>
          {label}
        </p>
        <p className="text-2xl font-extrabold leading-none mb-2" style={{ color: textColor }}>
          {value}
        </p>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold px-1.5 py-0.5 rounded-lg"
            style={{
              backgroundColor: trendUp
                ? (bg === '#ffffff' ? '#dcfce7' : 'rgba(255,255,255,0.2)')
                : '#fee2e2',
              color: trendUp
                ? (bg === '#ffffff' ? '#16a34a' : 'white')
                : '#dc2626',
            }}>
            {trendUp ? '↑' : '↓'} {trend}
          </span>
          <span className="text-[11px]"
            style={{ color: bg === '#ffffff' ? '#94A3B8' : 'rgba(255,255,255,0.6)' }}>
            {sub}
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default StatsCards;
