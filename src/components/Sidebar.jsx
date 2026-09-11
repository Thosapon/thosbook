// src/components/Sidebar.jsx
import React, { useState } from 'react';

export default function Sidebar({ categories, activeCategory, setActiveCategory, onNewCategory }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300 flex-shrink-0 space-y-4`}>
      {/* Profile & Collapse Toggle Card */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
            T
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden">
              <h4 className="font-semibold text-gray-800 text-sm leading-tight truncate">Thosapon</h4>
              <p className="text-xs text-gray-400">Viewer</p>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <i className={`fa-solid ${isCollapsed ? 'fa-square-caret-right' : 'fa-square-caret-left'} text-base`}></i>
        </button>
      </div>

      {/* Categories Menu Card */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 space-y-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              title={isCollapsed ? cat.name : ''}
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center py-3' : 'space-x-3 px-3 py-2.5'
              } rounded-xl text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-[#0F4C81] font-semibold'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <i className={`${cat.icon || 'fa-solid fa-folder'} text-sm ${isActive ? 'text-[#0F4C81]' : 'text-gray-400'}`}></i>
              {!isCollapsed && <span className="truncate">{cat.name}</span>}
            </button>
          );
        })}

        {/* Add Category Button */}
        <button
          onClick={onNewCategory}
          title={isCollapsed ? 'New Category' : ''}
          className={`w-full mt-3 flex items-center justify-center ${
            isCollapsed ? 'p-3' : 'space-x-2 py-2.5'
          } bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-colors`}
        >
          <i className="fa-solid fa-plus text-xs"></i>
          {!isCollapsed && <span>New Category</span>}
        </button>
      </div>
    </aside>
  );
}