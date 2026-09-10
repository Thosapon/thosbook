// src/views/NotificationsView.jsx
import React from 'react';

export const NotificationsView = () => {
  const notifications = [
    { id: 1, title: 'ยืมหนังสือสำเร็จ', desc: 'คุณได้ทำรายการยืม "Clean Code"', time: '10 นาทีที่แล้ว' },
    { id: 2, title: 'ใกล้ครบกำหนดคืน', desc: 'หนังสือ "Design Patterns" กำหนดคืนในอีก 2 วัน', time: '1 ชั่วโมงที่แล้ว' }
  ];

  return (
    <div className="p-5 max-w-4xl mx-auto space-y-4 pb-24">
      <h2 className="text-xl font-bold text-slate-900">ศูนย์การแจ้งเตือน</h2>
      <div className="space-y-3">
        {notifications.map((item) => (
          <div key={item.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <h4 className="font-bold text-sm text-slate-900">{item.title}</h4>
            <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
            <span className="text-[10px] text-slate-400 mt-2 block">{item.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
};