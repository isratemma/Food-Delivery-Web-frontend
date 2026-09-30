import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineClock,
  HiOutlineEllipsisVertical,
  HiOutlineEye,
  HiOutlineEyeSlash,
} from 'react-icons/hi2';
import { deleteItem, toggleItem, selectItemLoading } from '../../store/slices/itemSlice';

const ItemCard = ({ item, onEdit }) => {
  const dispatch  = useDispatch();
  const loading   = useSelector(selectItemLoading);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [deleting,   setDeleting]   = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${item.name}"? This cannot be undone.`)) return;
    setMenuOpen(false);
    setDeleting(true);
    await dispatch(deleteItem(item._id));
    setDeleting(false);
  };

  const handleToggle = () => dispatch(toggleItem(item._id));

  return (
    <div className="bg-white rounded-2xl border border-[#EDE8F0] overflow-hidden group hover:shadow-md transition-all">

      {/* Image */}
      <div className="relative h-36 bg-[#F8F5FC] overflow-hidden">
        {item.image
          ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-5xl select-none">🍽️</div>
        }

        {/* Availability overlay badge */}
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-xs font-bold text-white bg-black/50 px-3 py-1 rounded-full">Hidden</span>
          </div>
        )}

        {/* Veg badge */}
        {item.isVeg && (
          <span className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-green-500 text-white">
            VEG
          </span>
        )}

        {/* Discount badge */}
        {item.discountPrice && (
          <span className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-[#5b3256] text-white">
            SALE
          </span>
        )}

        {/* Hover actions overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Top-right menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="w-7 h-7 rounded-lg bg-white/90 shadow flex items-center justify-center text-[#5b3256] hover:bg-white transition-colors"
            >
              <HiOutlineEllipsisVertical size={15} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-8 z-20 w-36 bg-white rounded-xl border border-[#EDE8F0] shadow-lg py-1 overflow-hidden">
                  <button
                    onClick={() => { onEdit(item); setMenuOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#0F172A] hover:bg-[#F8F5FC] transition-colors"
                  >
                    <HiOutlinePencilSquare size={14} className="text-[#5b3256]" />
                    Edit
                  </button>
                  <button
                    onClick={handleToggle}
                    disabled={loading}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-[#0F172A] hover:bg-[#F8F5FC] transition-colors disabled:opacity-50"
                  >
                    {item.isAvailable
                      ? <><HiOutlineEyeSlash size={14} className="text-[#94A3B8]" />Hide</>
                      : <><HiOutlineEye size={14} className="text-green-500" />Show</>
                    }
                  </button>
                  <div className="h-px bg-[#F5F0F7] my-1" />
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                  >
                    <HiOutlineTrash size={14} />
                    {deleting ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <p className="text-sm font-semibold text-[#0F172A] leading-tight line-clamp-2 flex-1">
            {item.name}
          </p>
        </div>

        {item.description && (
          <p className="text-[11px] text-[#94A3B8] line-clamp-1 mb-2">{item.description}</p>
        )}

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold text-[#5b3256]">৳{item.price}</span>
            {item.discountPrice && (
              <span className="text-xs text-[#94A3B8] line-through">৳{item.discountPrice}</span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
            <HiOutlineClock size={11} />{item.preparationTime}m
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5F0F7]">
          {/* Toggle availability */}
          <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all disabled:opacity-50
              ${item.isAvailable
                ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'
                : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0] hover:bg-[#F1F5F9]'
              }`}
          >
            {item.isAvailable ? '● Available' : '○ Hidden'}
          </button>

          {/* Edit button */}
          <button
            onClick={() => onEdit(item)}
            className="w-7 h-7 rounded-lg bg-[#F8F5FC] flex items-center justify-center text-[#5b3256] hover:bg-[#F0EDF3] transition-colors"
          >
            <HiOutlinePencilSquare size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
