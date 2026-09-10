// src/router/AppRouter.jsx
import React, { useState } from 'react';
import { DashboardView } from '../views/DashboardView.jsx';
import { MobileDashboardView } from '../views/MobileDashboardView.jsx';
import { CategoriesView } from '../views/CategoriesView.jsx';
import { NotificationsView } from '../views/NotificationsView.jsx';
import { SettingsView } from '../views/SettingsView.jsx';
import { MobileBottomNav } from '../components/MobileBottomNav.jsx';

export const AppRouter = () => {
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
            {/* Render Responsive Views */}
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
    <div className="min-h-screen bg-slate-50 relative">
      {/* Dynamic View Content */}
      {renderView()}

      {/* Mobile Single Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        onViewChange={(viewId) => setCurrentView(viewId)}
      />
    </div>
  );
};