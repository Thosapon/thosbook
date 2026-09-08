/**
 * Thosbook - Auth & Session Guard
 * จัดการ Session ของผู้ใช้ สิทธิ์ Admin/Viewer และ Logout
 */

const ThosbookAuth = {
  // ดึงข้อมูล User Session ปัจจุบัน
  getUser() {
    return JSON.parse(localStorage.getItem("thosbook_user") || "null");
  },

  // เช็กว่าเข้าสู่ระบบแล้วหรือยัง
  isAuthenticated() {
    return this.getUser() !== null;
  },

  // เช็กสิทธิ์ว่าเป็น Admin หรือไม่
  isAdmin() {
    const user = this.getUser();
    if (!user) return false;
    
    const role = (user.role || "").toString().toLowerCase();
    const username = (user.username || "").toString().toLowerCase();
    return role === "admin" || username === "admin";
  },

  // บันทึก Session เมื่อ Login ผ่าน
  setSession(userData) {
    localStorage.setItem("thosbook_user", JSON.stringify(userData));
  },

  // ออกจากระบบ
  logout() {
    localStorage.removeItem("thosbook_user");
    window.location.href = "login.html";
  },

  // Guard สำหรับหน้าทั่วไป (ต้องเข้าสู่ระบบก่อน)
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = "login.html";
    }
  },

  // Guard สำหรับหน้า Admin (ต้องเป็น Admin เท่านั้น)
  requireAdmin() {
    if (!this.isAuthenticated()) {
      window.location.href = "login.html";
      return;
    }
    if (!this.isAdmin()) {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้ (สำหรับ Admin เท่านั้น)");
      window.location.href = "dashboard.html";
    }
  }
};