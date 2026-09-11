// src/views/DashboardView.jsx
import React, { useState } from 'react';
import { useThosbook } from '../context/ThosbookContext.jsx';
import BookCard from '../components/BookCard.jsx';
import { BorrowReturnModal } from '../components/BorrowReturnModal.jsx';
import { NotificationBadge } from '../components/NotificationBadge.jsx';

export const DashboardView = () => {
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
  const [notificationCount, setNotificationCount] = useState(3);

  const handleOpenBorrowModal = (book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center font-black text-slate-900 text-lg">
              T
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Thosbook</h1>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setCurrentCategory('all')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                currentCategory === 'all'
                  ? 'bg-amber-400 text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>📚</span>
              <span>หนังสือทั้งหมด</span>
            </button>

            <div className="pt-4 pb-2 text-xs font-bold text-slate-400 uppercase tracking-wider px-4">
              หมวดหมู่
            </div>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCurrentCategory(cat.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  currentCategory === cat.id
                    ? 'bg-amber-100 text-slate-900 font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color || '#0c3d88' }} />
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto">
        {/* Top Header */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="ค้นหาหนังสือ, ผู้แต่ง หรือเนื้อหา..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-slate-400 shadow-sm transition-all"
            />
            <span className="absolute left-3.5 top-2.5 text-slate-400">🔍</span>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBadge
              count={notificationCount}
              onClick={() => setNotificationCount(0)}
            />
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-slate-700">
                U
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 text-sm font-medium">
            กำลังโหลดข้อมูลหนังสือ...
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 text-slate-400 text-sm">
            ไม่พบรายการหนังสือในหมวดหมู่นี้
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
