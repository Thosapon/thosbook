/**
 * Thosbook - Auth Guard & Custom UI Helper
 */
const ThosbookAuth = {
  getUser() {
    return JSON.parse(localStorage.getItem("thosbook_user") || "null");
  },

  isAuthenticated() {
    return this.getUser() !== null;
  },

  setSession(user) {
    localStorage.setItem("thosbook_user", JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem("thosbook_user");
    window.location.href = "index.html";
  },

  requireAuth() {
    if (!this.getUser()) {
      window.location.href = "index.html";
    }
  },

  requireAdmin() {
    const user = this.getUser();
    if (!user || user.role !== "admin") {
      window.location.href = "dashboard.html";
    }
  },

  isAdmin() {
    const user = this.getUser();
    return user && user.role === "admin";
  }
};

/**
 * ThosbookUI - SweetAlert2 Wrapper (Controlled via css/theme.css)
 */
const ThosbookUI = {
  alert(title, text, icon = 'info') {
    return Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: 'ตกลง',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-3xl p-6 shadow-2xl border border-gray-100 font-prompt',
        title: 'text-xl font-bold text-brand-darkNavy font-montserrat',
        htmlContainer: 'text-sm text-gray-500 font-prompt mt-1',
        confirmButton: 'bg-brand-navy hover:bg-blue-900 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md mt-4 cursor-pointer'
      }
    });
  },

  success(title, text = '') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'success',
      confirmButtonText: 'ตกลง',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-3xl p-6 shadow-2xl border border-gray-100 font-prompt',
        title: 'text-xl font-bold text-brand-darkNavy font-montserrat',
        htmlContainer: 'text-sm text-gray-500 font-prompt mt-1',
        confirmButton: 'bg-brand-navy hover:bg-blue-900 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md mt-4 cursor-pointer'
      }
    });
  },

  confirm(title, text, confirmText = 'ใช่, ต้องการลบ') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: 'ยกเลิก',
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-3xl p-6 shadow-2xl border border-gray-100 font-prompt',
        title: 'text-xl font-bold text-brand-darkNavy font-montserrat',
        htmlContainer: 'text-sm text-gray-500 font-prompt mt-1',
        confirmButton: 'bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md mr-3 mt-4 cursor-pointer',
        cancelButton: 'bg-gray-100 hover:bg-gray-200 text-brand-darkNavy font-semibold px-5 py-2.5 rounded-xl text-sm transition-all mt-4 cursor-pointer'
      }
    });
  }
};