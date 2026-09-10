// src/views/CategoriesView.jsx
import React from 'react';
import { useThosbook } from '../context/ThosbookContext.jsx';

export const CategoriesView = () => {
  const { categories, setCurrentCategory } = useThosbook();

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-4 pb-24">
      <h2 className="text-xl font-bold text-slate-900">จัดการหมวดหมู่</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {categories.map((cat) => (
          <div 
            key={cat.id} 
            onClick={() => setCurrentCategory(cat.id)}
            className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between cursor-pointer hover:border-amber-300 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: cat.color || '#0c3d88' }} />
              <span className="font-semibold text-slate-800 text-sm">{cat.name}</span>
            </div>
            <span className="text-slate-400 text-xs">↗</span>
          </div>
        ))}
      </div>
    </div>
  );
};