// src/views/MobileDashboardView.jsx
import React, { useState } from 'react';
import { useThosbook } from '../context/ThosbookContext.jsx';
import { BookCard } from '../components/BookCard.jsx';
import { BorrowReturnModal } from '../components/BorrowReturnModal.jsx';
import { NotificationBadge } from '../components/NotificationBadge.jsx';

export const MobileDashboardView = () => {
  const {
    categories,
    bookmarks,
    currentCategory,
    setCurrentCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    error
  } = useThosbook();

  const [selectedBook, setSelectedBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(2);

  const handleOpenBorrowModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900 md:hidden">
      {/* Mobile Top App Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center font-black text-slate-900 text-base">
            T
          </div>
          <h1 className="text-lg font-extrabold tracking-tight">Thosbook</h1>
        </div>
        <NotificationBadge
          count={notificationCount}
          onClick={() => setNotificationCount(0)}
        />
      </header>

      {/* Mobile Sticky Search & Category Chips */}
      <div className="p-4 space-y-3 bg-white border-b border-slate-100 shadow-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาหนังสือ..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-xl text-xs focus:outline-none focus:bg-white focus:ring-2 focus:ring-amber-400 transition-all"
          />
          <span className="absolute left-3 top-2 text-xs text-slate-400">🔍</span>
        </div>

        {/* Scrollable Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setCurrentCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              currentCategory === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            ทั้งหมด
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCurrentCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                currentCategory === cat.id
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main List Body */}
      <main className="p-4">
        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">
            กำลังโหลดข้อมูล...
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 text-slate-400 text-xs">
            ไม่พบรายการหนังสือ
          </div>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onBorrowClick={handleOpenBorrowModal}
              />
            ))}
          </div>
        )}
      </main>

      {/* Borrow Modal */}
      <BorrowReturnModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        book={selectedBook}
      />
    </div>
  );
};