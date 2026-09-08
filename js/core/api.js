/**
 * Thosbook - Centralized API Wrapper
 * จัดการการเชื่อมต่อดึง/บันทึกข้อมูลกับ Google Apps Script (GAS)
 */

const ThosbookAPI = {
  /**
   * Helper ส่ง Request ไปยัง Google Apps Script (GET)
   */
  async get(action) {
    try {
      const response = await fetch(`${GAS_API_URL}?action=${action}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`[API GET Error] ${action}:`, error);
      throw error;
    }
  },

  /**
   * Helper ส่ง Request ไปยัง Google Apps Script (POST)
   */
  async post(payload) {
    try {
      const response = await fetch(GAS_API_URL, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error(`[API POST Error] ${payload.action}:`, error);
      throw error;
    }
  },

  // --- CATEGORY SERVICES ---
  async getCategories() {
    return await this.get("getCategories");
  },

  async addCategory(categoryData) {
    return await this.post({
      action: "addCategory",
      data: categoryData
    });
  },

  async updateCategory(id, categoryData) {
    return await this.post({
      action: "updateCategory",
      id: id,
      data: categoryData
    });
  },

  async deleteCategory(id) {
    return await this.post({
      action: "deleteCategory",
      id: id
    });
  },

  // --- BOOKMARK SERVICES ---
  async getBookmarks() {
    return await this.get("getBookmarks");
  },

  async addBookmark(bookmarkData) {
    return await this.post({
      action: "addBookmark",
      data: bookmarkData
    });
  },

  async updateBookmark(id, bookmarkData) {
    return await this.post({
      action: "updateBookmark",
      id: id,
      data: bookmarkData
    });
  },

  async deleteBookmark(id) {
    return await this.post({
      action: "deleteBookmark",
      id: id
    });
  },

  // --- USER SERVICES ---
  async getUsers() {
    return await this.get("getUsers");
  },

  async addUser(userData) {
    return await this.post({
      action: "addUser",
      data: userData
    });
  },

  async updateUser(id, userData) {
    return await this.post({
      action: "updateUser",
      id: id,
      data: userData
    });
  },

  async deleteUser(id) {
    return await this.post({
      action: "deleteUser",
      id: id
    });
  },

  // --- AUTH SERVICES ---
  async login(username, password) {
    return await this.post({
      action: "login",
      username: username,
      password: password
    });
  }
};