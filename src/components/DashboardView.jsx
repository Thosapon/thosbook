// src/views/DashboardView.jsx
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BookCard from '../components/BookCard';

export default function DashboardView({ items = [], categories = [], onNewBookmark, onNewCategory }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onLogout={() => {}} />

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 flex space-x-8">
        {/* Left Sidebar */}
        <Sidebar
          categories={categories}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          onNewCategory={onNewCategory}
        />

        {/* Right Main Content */}
        <main className="flex-1 space-y-6">
          {/* Top Actions */}
          <div className="flex justify-end">
            <button
              onClick={onNewBookmark}
              className="bg-[#0F4C81] hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-sm transition-colors"
            >
              <i className="fa-solid fa-plus"></i>
              <span>New Bookmark</span>
            </button>
          </div>

          {/* Cards Grid (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <BookCard key={item.id} item={item} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}