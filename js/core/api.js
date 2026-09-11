import { API_BASE_URL } from './config.js';

//const GAS_API_URL = API_BASE_URL;
const GAS_API_URL = '/api/gas-proxy'; // เรียก proxy ของตัวเอง แทนการยิงตรงไป script.google.com
const TIMEOUT_MS = 10000;

/**
 * Centralized Fetch Wrapper พร้อม AbortController Timeout & Standardized Response Format
 */
async function fetchApi(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const result = await response.json();
    return {
      success: result.success ?? true,
      data: result.data ?? result,
      error: null
    };
  } catch (err) {
    clearTimeout(timeoutId);
    const errorMessage = err.name === 'AbortError' 
      ? 'การเชื่อมต่อหมดเวลา (Timeout)' 
      : (err.message || 'ไม่สามารถเชื่อมต่อระบบได้');
      
    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
}

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
