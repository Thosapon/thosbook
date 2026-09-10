// สร้างไฟล์ใหม่: src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter.jsx';
import { ThosbookProvider } from './context/ThosbookContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThosbookProvider>
      <AppRouter />
    </ThosbookProvider>
  </React.StrictMode>
);