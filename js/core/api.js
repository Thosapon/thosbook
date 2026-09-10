/**
 * Thosbook - Centralized API Wrapper
 */
import { GAS_API_URL } from './config.js';

/**
 * ฟังก์ชันกลางสำหรับเรียกใช้งาน API พร้อม Error Handling และ Timeout Controller
 * @param {string} url - API Endpoint URL
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {number} timeout - ระยะเวลา Timeout (มิลลิวินาที) ค่าเริ่มต้น 10000ms
 */
export async function fetchApi(url, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      throw new Error(`HTTP Error status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data,
      error: null
    };

  } catch (error) {
    clearTimeout(timer);

    let errorMessage = 'เกิดข้อผิดพลาดในการเชื่อมต่อระบบ';

    if (error.name === 'AbortError') {
      errorMessage = 'การเชื่อมต่อหมดเวลา (Timeout) กรุณาลองใหม่อีกครั้ง';
    } else if (error.message) {
      errorMessage = error.message;
    }

    console.error('[API Fetch Error]:', error);

    // คืนค่า Standard Error State ให้ UI นำไปจัดการต่อได้ง่าย
    return {
      success: false,
      data: null,
      error: errorMessage
    };
  }
}

export default {
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