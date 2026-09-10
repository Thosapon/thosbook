// ตำแหน่งที่แก้ไข: src/router/AppRouter.jsx -> เคลียร์ Import ชนกัน และใส่ Fallback ป้องกัน Build Error

import React, { useState, lazy, Suspense } from 'react';

// Eager Imports สำหรับ Layout หลักที่มีไฟล์อยู่จริง
import { DashboardView } from '../views/DashboardView.jsx';
import { MobileDashboardView } from '../views/MobileDashboardView.jsx';

// Core UI Components
import { MobileBottomNav } from '../components/MobileBottomNav.jsx';
import { ErrorBoundary } from '../components/ErrorBoundary.jsx';
import OfflineBanner from '../components/OfflineBanner.jsx';

// Safe Dynamic Lazy Imports สำหรับ Views รอง
const CategoriesView = lazy(() => 
  import('../views/CategoriesView.jsx')
    .then(m => ({ default: m.CategoriesView || m.default }))
    .catch(() => ({ default: () => <div className="p-6 text-slate-500 text-center">หน้าจัดการหมวดหมู่ (กำลังพัฒนา)</div> }))
);

const NotificationsView = lazy(() => 
  import('../views/NotificationsView.jsx')
    .then(m => ({ default: m.NotificationsView || m.default }))
    .catch(() => ({ default: () => <div className="p-6 text-slate-500 text-center">ศูนย์การแจ้งเตือน (กำลังพัฒนา)</div> }))
);

const SettingsView = lazy(() => 
  import('../views/SettingsView.jsx')
    .then(m => ({ default: m.SettingsView || m.default }))
    .catch(() => ({ default: () => <div className="p-6 text-slate-500 text-center">ตั้งค่าระบบ (กำลังพัฒนา)</div> }))
);

// Fallback Loading UI
const ViewLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-slate-500 font-medium">กำลังโหลดข้อมูล...</p>
    </div>
  </div>
);

export default function AppRouter() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'categories':
        return <CategoriesView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'dashboard':
      default:
        return (
          <>
            <div className="hidden md:block">
              <DashboardView />
            </div>
            <div className="block md:hidden">
              <MobileDashboardView />
            </div>
          </>
        );
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-50 relative flex flex-col justify-between">
        <OfflineBanner />

        <main className="flex-1 pb-16 md:pb-0">
          <Suspense fallback={<ViewLoader />}>
            {renderView()}
          </Suspense>
        </main>

        <MobileBottomNav
          currentView={currentView}
          onViewChange={(viewId) => setCurrentView(viewId)}
        />
      </div>
    </ErrorBoundary>
  );
}