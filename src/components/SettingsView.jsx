// src/views/SettingsView.jsx
import React from 'react';

export const SettingsView = () => {
  return (
    <div className="p-5 max-w-4xl mx-auto space-y-4 pb-24">
      <h2 className="text-xl font-bold text-slate-900">การตั้งค่าบัญชี</h2>
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-lg">
            U
          </div>
          <div>
            <h3 className="font-bold text-sm text-slate-900">User Account</h3>
            <p className="text-xs text-slate-400">user@thosbook.local</p>
          </div>
        </div>
        <button className="w-full text-left py-2 text-xs font-semibold text-rose-600 hover:text-rose-800">
          ออกจากระบบ
        </button>
      </div>
    </div>
  );
};