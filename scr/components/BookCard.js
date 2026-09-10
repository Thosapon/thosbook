// src/components/BookCard.jsx
import React from 'react';

export const BookCard = ({ book, onBorrowClick }) => {
  // Defensive Check ป้องกันแอปพังเมื่อข้อมูลเป็น null/undefined
  if (!book) return null;

  const isAvailable = book.status === 'available';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
            isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
          }`}>
            {isAvailable ? 'พร้อมยืม' : 'ถูกยืมอยู่'}
          </span>
          {book.category && (
            <span className="text-xs text-gray-500 font-medium truncate max-w-[120px]">
              {book.category}
            </span>
          )}
        </div>

        {book.cover_url && (
          <div className="mb-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 aspect-[4/3]">
            <img 
              src={book.cover_url} 
              alt={book.title || 'Book cover'} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
            />
          </div>
        )}

        <h3 className="text-base font-bold text-slate-900 line-clamp-2">
          {book.title || 'ไม่มีชื่อหนังสือ'}
        </h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-1">
          ผู้แต่ง: {book.author || 'ไม่ระบุ'}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400">รหัส: {book.id || '-'}</span>
        <button
          onClick={() => onBorrowClick?.(book)}
          disabled={!isAvailable}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            isAvailable 
              ? 'bg-brand-accentOrange text-brand-darkNavy hover:bg-amber-400 cursor-pointer' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'ทำรายการยืม' : 'ไม่พร้อมยืม'}
        </button>
      </div>
    </div>
  );
};