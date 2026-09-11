// ตำแหน่งที่แก้ไข: js/core/config.js

const GET_API_URL = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return "https://script.google.com/macros/s/AKfycbxf9lX_LoYN7GXLHUYsihZYqLBrg05rX31nAnt6BVyYQllY_KpRjL69mRuNgCaHWgoi/exec";
};

// Export ทั้ง GAS_API_URL และ API_BASE_URL เพื่อรองรับทั้งสองชื่อ
export const GAS_API_URL = GET_API_URL();
export const API_BASE_URL = GAS_API_URL;

export const CONFIG = {
  API_BASE_URL: GAS_API_URL,
  REQUEST_TIMEOUT: 15000,
  APP_NAME: 'Thosbook',
  VERSION: '2.0.0-SPA'
};

export default CONFIG;
