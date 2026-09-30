import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineEllipsisVertical,
} from 'react-icons/hi2';
import { deleteItem, toggleItem, selectItemLoading } from '../../store/slices/itemSlice';

const ItemList = ({ items, onEdit }) => {
  const dispatch    = useDispatch();
  const loading     = useSelector(selectItemLoading);
  const [deletingId, setDeletingId]   = useState(null);
  const [menuOpenId, setMenuOpenId]   = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setMenuOpenId(null);
    setDeletingId(id);
    await dispatch(deleteItem(id));
    setDeletingId(null);
  };

  if (!items?.length) {
    return (
      <div className="bg-white rounded-2xl border border-[#EDE8F0] flex flex-col items-center justify-center py-20 text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-[#F8F5FC] flex items-center justify-center mb-4">
          <span className="text-3xl">🍽️</span>
        </div>
        <p className="font-semibold text-[#0F172A] mb-1">No items yet</p>
        <p className="text-sm text-[#94A3B8]">Add your first menu item to get started</p>
      </div>
    );
  }

  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category}>
          {/* Category header */}
          <div className="flex items-center gap-3 mb-3">
            <p className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">{category}</p>
            <span className="text-[11px] bg-[#F0EDF3] text-[#5b3256] font-semibold px-2 py-0.5 rounded-full">
              {catItems.length}
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-[#EDE8F0] overflow-hidden">
            {catItems.map((item, idx) => (
              <div key={item._id}
                className={`group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-[#FDFAFF]
                  ${idx !== catItems.length - 1 ? 'border-b border-[#F5F0F7]' : ''}`}
              >
                {/* Image */}
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-[#F8F5FC] shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-lg">🍽️</div>
                  }
                </div>

                {/* Name + badges */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-[#0F172A]">{item.name}</p>
                    {item.isVeg && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-green-50 text-green-600 border border-green-100">
                        VEG
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm font-bold text-[#5b3256]">৳{item.price}</span>
                    {item.discountPrice && (
                      <span className="text-xs text-[#94A3B8] line-through">৳{item.discountPrice}</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                      <HiOutlineClock size={11} />{item.preparationTime}m
                    </span>
                  </div>
                </div>

                {/* Availability pill */}
                <button
                  onClick={() => dispatch(toggleItem(item._id))}
                  disabled={loading}
                  className={`shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full border transition-all
                    ${item.isAvailable
                      ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                      : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                    }`}
                >
                  {item.isAvailable ? '● Available' : '○ Hidden'}
                </button>

                {/* Actions menu */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => setMenuOpenId(menuOpenId === item._id ? null : item._id)}
                    className="w-8 h-8 rounded-lg text-[#94A3B8] hover:text-[#5b3256] hover:bg-[#F0EDF3] flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <HiOutlineEllipsisVertical size={16} />
                  </button>

                  {menuOpenId === item._id && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setMenuOpenId(null)} />
                      <div className="absolute right-0 top-9 z-20 w-36 bg-white rounded-xl border border-[#EDE8F0] shadow-lg py-1 overflow-hidden">
                        <button
                          onClick={() => { onEdit(item); setMenuOpenId(null); }}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#0F172A] hover:bg-[#F8F5FC] transition-colors"
                        >
                          <HiOutlinePencilSquare size={15} className="text-[#5b3256]" />
                          Edit item
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          disabled={deletingId === item._id}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                        >
                          <HiOutlineTrash size={15} />
                          {deletingId === item._id ? 'Deleting…' : 'Delete'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
