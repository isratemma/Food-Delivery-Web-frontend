import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineClock,
} from 'react-icons/hi2';
import { deleteItem, toggleItem, selectItemLoading } from '../../store/slices/itemSlice';

const ItemList = ({ items, onEdit }) => {
  const dispatch = useDispatch();
  const loading  = useSelector(selectItemLoading);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    setDeletingId(id);
    await dispatch(deleteItem(id));
    setDeletingId(null);
  };

  if (!items?.length) {
    return (
      <div className="bg-white rounded-2xl border border-[#F0E8E4] flex flex-col items-center justify-center py-16 text-center px-4">
        <span className="text-5xl mb-3">🍽️</span>
        <p className="font-semibold text-[#0F172A]">No items yet</p>
        <p className="text-sm text-[#64748B] mt-1">Add your first menu item to get started</p>
      </div>
    );
  }

  // Group items by category
  const grouped = items.reduce((acc, item) => {
    const cat = item.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([category, catItems]) => (
        <div key={category}>
          <p className="text-xs font-bold uppercase tracking-wider text-[#94A3B8] mb-3 px-1">{category}</p>
          <div className="bg-white rounded-2xl border border-[#F0E8E4] overflow-hidden">
            {catItems.map((item, idx) => (
              <div
                key={item._id}
                className={`flex items-center gap-4 px-4 py-3.5 ${idx !== catItems.length - 1 ? 'border-b border-[#F8F4F7]' : ''}`}
              >
                {/* Image */}
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F8FAFC] shrink-0">
                  {item.image
                    ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                  }
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{item.name}</p>
                    {item.isVeg && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-50 text-green-600 shrink-0">VEG</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-sm font-semibold text-[#5b3256]">৳{item.price}</span>
                    {item.discountPrice && (
                      <span className="text-xs text-[#94A3B8] line-through">৳{item.discountPrice}</span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-[#94A3B8]">
                      <HiOutlineClock size={11} /> {item.preparationTime}m
                    </span>
                  </div>
                </div>

                {/* Status + Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Availability toggle */}
                  <button
                    onClick={() => dispatch(toggleItem(item._id))}
                    disabled={loading}
                    title={item.isAvailable ? 'Mark unavailable' : 'Mark available'}
                    className="transition-opacity hover:opacity-70"
                  >
                    {item.isAvailable
                      ? <HiOutlineCheckCircle size={20} className="text-green-500" />
                      : <HiOutlineXCircle    size={20} className="text-[#DCDCDC]" />
                    }
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEdit(item)}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-[#5b3256] hover:bg-[#f5eef4] transition-colors"
                  >
                    <HiOutlinePencilSquare size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={deletingId === item._id}
                    className="p-1.5 rounded-lg text-[#64748B] hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
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
