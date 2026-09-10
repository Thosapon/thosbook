// src/components/MobileBottomNav.jsx
import React from 'react';

export const MobileBottomNav = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'หน้าแรก', icon: '🏠' },
    { id: 'categories', label: 'หมวดหมู่', icon: '📁' },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: '🔔' },
    { id: 'settings', label: 'ตั้งค่า', icon: '⚙️' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 py-1.5 flex justify-around md:hidden shadow-lg">
      {navItems.map((item) => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center justify-center w-full py-1 rounded-xl transition-all ${
              isActive ? 'text-amber-600 font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};