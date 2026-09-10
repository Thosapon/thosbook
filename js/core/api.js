/**
 * Thosbook - Centralized API Wrapper
 */
const ThosbookAPI = {
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
  }
};