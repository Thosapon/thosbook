// src/components/BookCard.jsx
import React from 'react';

export default function BookCard({ item }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow h-full">
      <div>
        {/* Category Tag */}
        <span className="text-xs font-medium text-gray-400 block mb-2">
          {item.categoryName || 'General'}
        </span>

        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug">
          {item.title}
        </h3>

        {/* Optional Image Preview */}
        {item.imageUrl && (
          <div className="mb-4 rounded-xl overflow-hidden max-h-48 bg-gray-100">
            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-4 leading-relaxed mb-4">
            {item.description}
          </p>
        )}
      </div>

      {/* Footer Link Action */}
      <div className="pt-2 border-t border-gray-50">
        <a
          href={item.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-[#0F4C81] hover:underline"
        >
          <span>เปิดลิงก์</span>
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
        </a>
      </div>
    </div>
  );
}