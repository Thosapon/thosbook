// src/components/BorrowReturnModal.jsx
import React, { useState } from 'react';
import { useThosbook } from '../context/ThosbookContext.jsx';
import ThosbookAPI from '../../js/core/api.js';

export const BorrowReturnModal = ({ isOpen, onClose, book }) => {
  const { refreshData } = useThosbook();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [dueDate, setDueDate] = useState('');

  if (!isOpen || !book) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    
    try {
      // ยิงข้อมูลบันทึกการยืมไปยัง Google Apps Script
      const res = await ThosbookAPI.borrowBook({
        book_id: book.id,
        due_date: dueDate
      });

      if (res.success) {
        await refreshData(); // Sync ข้อมูลล่าสุดจาก Google Sheets
        onClose();
      } else {
        setErrorMessage(res.error || 'ไม่สามารถทำรายการยืมได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err) {
      console.error('Borrow submit error:', err);
      setErrorMessage('เกิดข้อผิดพลาดในการเชื่อมต่อกับ Google Sheets');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-gray-100">
        <div className="flex justify-between items-center pb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-slate-900">บันทึกการยืมหนังสือ</h3>
          <button 
            onClick={onClose}
            type="button"
            className="text-gray-400 hover:text-gray-600 text-lg font-semibold px-2 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">ชื่อหนังสือ</label>
            <input 
              type="text" 
              value={book.title || ''} 
              disabled 
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-700 font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">กำหนดวันคืน</label>
            <input 
              type="date" 
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-slate-800"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={loading || !dueDate}
              className="flex-1 py-2.5 rounded-xl bg-amber-400 text-slate-900 text-sm font-semibold hover:bg-amber-500 disabled:opacity-50 cursor-pointer transition-all shadow-sm"
            >
              {loading ? 'กำลังบันทึก...' : 'ยืนยันการยืม'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};