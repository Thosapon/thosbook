// src/components/Navbar.jsx
import React from 'react';

export default function Navbar({ searchTerm, setSearchTerm, onLogout }) {
  return (
    <header className="bg-[#0F4C81] text-white h-16 px-8 flex items-center justify-between shadow-sm sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="flex items-center space-x-2 font-bold text-xl tracking-wide">
        <span className="text-white text-lg">★</span>
        <span>Thosbook</span>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md mx-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-blue-800/60 text-white placeholder-blue-200 text-sm rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <i className="fa-solid fa-magnifying-glass absolute right-3 top-2.5 text-blue-200 text-sm"></i>
      </div>

      {/* User Actions */}
      <button
        onClick={onLogout}
        className="flex items-center space-x-2 text-sm text-blue-100 hover:text-white transition-colors"
      >
        <i className="fa-solid fa-right-from-bracket"></i>
        <span>Log out</span>
      </button>
    </header>
  );
}