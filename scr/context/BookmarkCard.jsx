// src/components/BookmarkCard.jsx
import React from 'react';

export const BookmarkCard = ({ item, onOpenImage }) => {
  const typeLabel = item.type === 'text' ? 'Text / Note' : (item.type === 'video' ? 'Video' : 'Link');
  const hostname = item.url ? new URL(item.url).hostname : '';

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 inline-block">
            {typeLabel}
          </span>
        </div>

        {item.image_url && (
          <div className="relative group/img mb-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
            <img 
              src={item.image_url} 
              alt={item.title || 'Bookmark'} 
              onClick={() => onOpenImage?.(item.image_url, item.title)}
              className="w-full h-40 object-cover cursor-pointer transition-transform duration-300 group-hover/img:scale-105" 
            />
          </div>
        )}

        <h3 className="text-base font-semibold text-slate-900 line-clamp-2">
          {item.title || 'ไม่มีหัวข้อ'}
        </h3>
        {item.content && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
            {item.content}
          </p>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-medium text-slate-800">
        <span className="truncate max-w-[150px]">{hostname}</span>
        {item.url && (
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-700 hover:underline font-semibold"
          >
            เปิดลิงก์ ↗
          </a>
        )}
      </div>
    </div>
  );
};