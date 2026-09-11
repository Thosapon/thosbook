// ... โค้ดส่วน import และ fetchApi ด้านบนคงเดิมไว้ ...
import { API_BASE_URL, CONFIG } from './config.js';

export const fetchApi = async (action, payload = {}, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CONFIG.TIMEOUT_MS || 10000);

  try {
    // ปรับการส่งข้อมูลให้ใช้ Content-Type: text/plain เพื่อป้องกัน CORS Preflight บน GAS
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action, ...payload }),
      signal: controller.signal,
      redirect: 'follow', // รองรับ 302 Redirect ของ Google Apps Script
      ...options,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    clearTimeout(timeoutId);
    console.error(`API Error [${action}]:`, error);
    return { 
      success: false, 
      error: error.name === 'AbortError' ? 'Request timed out' : error.message 
    };
  }
};

// 1. ประกาศตัวแปรและ Export Named Export ในชื่อ ThosbookAPI
export const ThosbookAPI = {
  async get(action) {
    return await fetchApi(`${GAS_API_URL}?action=${action}`, {
      method: "GET"
    });
  },

  async post(payload) {
    return await fetchApi(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
  },

  // --- SERVICES ---
  async getCategories() { return await this.get("getCategories"); },
  async addCategory(data) { return await this.post({ action: "addCategory", data }); },
  async updateCategory(id, data) { return await this.post({ action: "updateCategory", id, data }); },
  async deleteCategory(id) { return await this.post({ action: "deleteCategory", id }); },

  async getBookmarks() { return await this.get("getBookmarks"); },
  async addBookmark(data) { return await this.post({ action: "addBookmark", data }); },
  async updateBookmark(id, data) { return await this.post({ action: "updateBookmark", id, data }); },
  async deleteBookmark(id) { return await this.post({ action: "deleteBookmark", id }); },

  async getUsers() { return await this.get("getUsers"); },
  async addUser(data) { return await this.post({ action: "addUser", data }); },
  async updateUser(id, data) { return await this.post({ action: "updateUser", id, data }); },
  async deleteUser(id) { return await this.post({ action: "deleteUser", id }); },
  async getDashboardData() { return await this.get("getDashboardData"); },
  
  async login(username, password) {
    return await this.post({ action: "login", username, password });
  },

  // --- CENTRALIZED DATA SERVICES ---
  
  /**
   * ดึงข้อมูล Dashboard พร้อมจัดรูปแบบโครงสร้างข้อมูลที่ใช้ร่วมกันทั้ง Desktop และ Mobile
   */
  async getNormalizedDashboardData() {
    const res = await this.getDashboardData();
    if (!res.success) return res;

    const raw = res.data || {};
    return {
      success: true,
      data: {
        stats: raw.stats || { totalBooks: 0, borrowedBooks: 0, activeMembers: 0 },
        recentActivities: raw.recentActivities || raw.bookmarks || [],
        bookmarks: raw.bookmarks || raw.recentActivities || [],
        categories: raw.categories || []
      },
      error: null
    };
  },

  // --- BORROW & RETURN SERVICES ---

  /**
   * บันทึกการยืมหนังสือลง Google Sheets ผ่าน GAS
   */
  async borrowBook(borrowData) {
    return await this.post({
      action: "borrowBook",
      data: {
        book_id: borrowData.book_id,
        user_id: borrowData.user_id || "U001",
        borrow_date: new Date().toISOString().split('T')[0],
        due_date: borrowData.due_date
      }
    });
  },

  /**
   * บันทึกการคืนหนังสือลง Google Sheets ผ่าน GAS
   */
  async returnBook(bookId) {
    return await this.post({
      action: "returnBook",
      data: {
        book_id: bookId,
        return_date: new Date().toISOString().split('T')[0]
      }
    });
  },

  /**
   * ดึงข้อมูลหมวดหมู่ทั้งหมดพร้อม Handling คืนค่า Default Array เมื่อล้มเหลว
   */
  async getFormattedCategories() {
    const res = await this.getCategories();
    if (!res.success) return { success: false, data: [], error: res.error };
    return {
      success: true,
      data: Array.isArray(res.data) ? res.data : [],
      error: null
    };
  }
};

// 2. Export Default ควบคู่ไปด้วยเพื่อรองรับการ Import รูปแบบเดิม
export default ThosbookAPI;
