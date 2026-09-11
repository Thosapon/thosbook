// src/components/BookCard.jsx
import React from 'react';

export function BookCard({ item }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-border-default flex flex-col justify-between hover:shadow-md transition-shadow h-full">
      <div>
        {/* Category Tag */}
        <span className="text-xs font-medium text-text-muted block mb-2">
          {item?.categoryName || 'General'}
        </span>

        {/* Title */}
        <h3 className="text-base font-bold text-text-heading mb-3 leading-snug">
          {item?.title}
        </h3>

        {/* Optional Image Preview */}
        {item?.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden max-h-48 bg-gray-100">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Description */}
        {item?.description && (
          <p className="text-xs text-text-body line-clamp-4 leading-relaxed mb-4">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer Link Action */}
      <div className="pt-2 border-t border-border-default">
        <a
          href={item?.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-brand-blue-500 hover:underline"
        >
          <span>เปิดลิงก์</span>
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>
    </div>
  );
}

export default BookCard;
