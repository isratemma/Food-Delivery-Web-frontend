import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { HiOutlineSquares2X2, HiOutlineBars3, HiOutlinePencilSquare } from 'react-icons/hi2';
import { toggleItem } from '../../store/slices/itemSlice';
import ItemCard from './ItemCard';

const ItemList = ({ items, onEdit }) => {
  const dispatch = useDispatch();
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  if (!items?.length) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDE8F0] flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F8F5FC] flex items-center justify-center mb-4 text-3xl">
          🍽️
        </div>
        <p className="font-semibold text-[#0F172A] mb-1">No items yet</p>
        <p className="text-sm text-[#94A3B8]">Add your first menu item to get started</p>
      </div>
    );
  }

  // Group by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-7">

      {/* View toggle */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#94A3B8]">
          {items.length} item{items.length !== 1 ? 's' : ''} total
        </p>
        <div className="flex items-center gap-1 bg-[#F8F5FC] rounded-xl p-1">
          <button
            onClick={() => setView('grid')}
            title="Grid view"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
              ${view === 'grid' ? 'bg-white text-[#5b3256] shadow-sm' : 'text-[#94A3B8] hover:text-[#5b3256]'}`}
          >
            <HiOutlineSquares2X2 size={15} />
          </button>
          <button
            onClick={() => setView('list')}
            title="List view"
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors
              ${view === 'list' ? 'bg-white text-[#5b3256] shadow-sm' : 'text-[#94A3B8] hover:text-[#5b3256]'}`}
          >
            <HiOutlineBars3 size={15} />
          </button>
        </div>
      </div>

      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category}>
          {/* Category header */}
          <div className="flex items-center gap-2.5 mb-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">{category}</p>
            <span className="text-[11px] bg-[#F0EDF3] text-[#5b3256] font-semibold px-2 py-0.5 rounded-full">
              {catItems.length}
            </span>
            <div className="flex-1 h-px bg-[#F5F0F7]" />
          </div>

          {view === 'grid' ? (
            /* ── Grid view ── */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {catItems.map(item => (
                <ItemCard key={item._id} item={item} onEdit={onEdit} />
              ))}
            </div>
          ) : (
            /* ── List view ── */
            <div className="bg-white rounded-2xl border border-[#EDE8F0] overflow-hidden">
              {catItems.map((item, idx) => (
                <div key={item._id}
                  className={`flex items-center gap-4 px-5 py-3.5 hover:bg-[#FDFAFF] transition-colors group
                    ${idx !== catItems.length - 1 ? 'border-b border-[#F5F0F7]' : ''}`}
                >
                  {/* Image */}
                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-[#F8F5FC] shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center text-base">🍽️</div>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{item.name}</p>
                      {item.isVeg && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-600 border border-green-100 shrink-0">
                          VEG
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-[#94A3B8]">
                      <span className="font-bold text-[#5b3256]">৳{item.price}</span>
                      {item.discountPrice && <span className="line-through">৳{item.discountPrice}</span>}
                      <span>{item.preparationTime}m</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => dispatch(toggleItem(item._id))}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all
                        ${item.isAvailable
                          ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                          : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                        }`}
                    >
                      {item.isAvailable ? '● Available' : '○ Hidden'}
                    </button>
                    <button
                      onClick={() => onEdit(item)}
                      className="w-7 h-7 rounded-lg bg-[#F8F5FC] flex items-center justify-center text-[#5b3256] hover:bg-[#F0EDF3] transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <HiOutlinePencilSquare size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ItemList;
