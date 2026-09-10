import React, { useState, useEffect } from 'react';

/**
 * OfflineBanner Component
 * ตรวจจับการเชื่อมต่ออินเทอร์เน็ต และแสดง Banner แจ้งเตือนเมื่อ Offline
 */
export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-amber-600 text-white px-4 py-2 text-sm text-center font-medium shadow-md sticky top-0 z-50 flex items-center justify-center gap-2 transition-all">
      <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m-12.728 0a9 9 0 010-12.728m2.828 2.828a6 6 0 018.486 0m-8.486 8.486a6 6 0 010-8.486M12 12h.01" />
      </svg>
      <span>คุณกำลังใช้งานในสภาวะออฟไลน์ การทำรายการยืม-คืนจะบันทึกไม่ได้ชั่วคราว</span>
    </div>
  );
}