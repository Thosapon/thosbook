// ตำแหน่งที่แก้ไข: js/core/config.js (ผสาน API URL เป็น Single Source of Truth รองรับ Vite & Vercel)

/**
 * ดึงค่า API Base URL จาก Vite Environment Variable (VITE_API_BASE_URL)
 * หากไม่มีให้ใช้ค่า Default Production GAS Web App URL
 */
const GET_API_URL = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return "https://script.google.com/macros/s/AKfycbz5laiYb-YlMcrhogO0DqH2tl7Itqgj3ImQBF51O7O6H1xq-GgxW061X87ZjPJUknIH/exec";
};

export const GAS_API_URL = GET_API_URL();

export const CONFIG = {
  API_BASE_URL: GAS_API_URL,
  REQUEST_TIMEOUT: 15000, // 15 Seconds Timeout Controller
  APP_NAME: 'Thosbook',
  VERSION: '2.0.0-SPA'
};

export default CONFIG;