/**
 * Thosbook - Mobile UI Controller (Updated Version)
 * ควบคุมการ Render ข้อมูลและ Event บน Mobile Pages ทั้งหมด
 */

let mobileCategories = [];
let mobileBookmarks = [];

// --- INITIALIZE MOBILE APP ---
document.addEventListener("DOMContentLoaded", () => {
  // 1. ตรวจสอบ Session
  ThosbookAuth.requireAuth();

  // 2. แสดงข้อมูล Header User Profile
  renderHeaderProfile();

  // 3. Render Lucide Icons
  if (window.lucide) lucide.createIcons();

  // 4. โหลดข้อมูลตามหน้าปัจจุบัน
  const currentPage = window.location.pathname.split("/").pop();
  
  if (currentPage === "m_dashboard.html" || currentPage === "") {
    loadDashboardPage();
  } else if (currentPage === "m_category.html") {
    loadCategoryListPage();
  } else if (currentPage === "m_category_detail.html") {
    loadCategoryDetailPage();
  }
});

// --- RENDER HEADER PROFILE ---
function renderHeaderProfile() {
  const user = ThosbookAuth.getUser();
  if (!user) return;

  const nameEl = document.getElementById("header-user-name");
  const roleEl = document.getElementById("header-user-role");

  if (nameEl) nameEl.innerText = user.name || user.username || "User";
  if (roleEl) roleEl.innerText = user.role || "viewer";
}

// --- LOGOUT HANDLER ---
function handleLogout() {
  ThosbookAuth.logout();
}

// ==========================================
// 📱 PAGE 1: HOME DASHBOARD (m_dashboard.html)
// ==========================================
async function loadDashboardPage() {
  const container = document.getElementById("mobile-bookmark-list-container");
  if (!container) return;

  try {
    // ดึงทั้ง Categories และ Bookmarks มาพร้อมกัน
    const [categories, bookmarks] = await Promise.all([
      ThosbookAPI.getCategories(),
      ThosbookAPI.getBookmarks()
    ]);

    mobileCategories = categories;
    mobileBookmarks = bookmarks;

    if (!Array.isArray(mobileBookmarks) || mobileBookmarks.length === 0) {
      container.innerHTML = `<div class="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">ไม่พบรายการ Bookmark</div>`;
      return;
    }

    renderBookmarkCards(mobileBookmarks, container);
  } catch (error) {
    console.error("Error loading mobile dashboard:", error);
    container.innerHTML = `<div class="bg-white rounded-3xl p-8 text-center text-red-500 text-sm shadow-sm border border-gray-100">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
  }
}

// Helper ฟังก์ชันสำหรับ Render Cards บุ๊กมาร์ก
function renderBookmarkCards(items, container) {
  container.innerHTML = "";

  items.forEach(bm => {
    // หาชื่อ Category Name จาก ID
    const cat = mobileCategories.find(c => String(c.id) === String(bm.category_id));
    const catName = cat ? cat.name : "General";

    const imageHtml = bm.image_url ? `
      <div class="mb-3 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
        <img src="${bm.image_url}" alt="${bm.title}" class="w-full h-40 object-cover" />
      </div>
    ` : '';

    const linkHtml = bm.url ? `
      <div class="pt-1">
        <a href="${bm.url}" target="_blank" class="text-sm font-semibold text-brand-navy hover:underline inline-block">เปิดลิงก์ ↗</a>
      </div>
    ` : '';

    container.innerHTML += `
      <div class="bg-white rounded-3xl p-6 shadow-sm space-y-3 border border-gray-100 w-full">
        <div class="text-sm font-semibold text-brand-darkNavy">${catName}</div>
        ${imageHtml}
        <h3 class="text-xl font-bold text-brand-darkNavy">${bm.title || 'ไม่มีหัวข้อ'}</h3>
        <p class="text-sm text-gray-500 leading-relaxed">${bm.content || ''}</p>
        ${linkHtml}
      </div>
    `;
  });

  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 📱 PAGE 2: CATEGORY LIST (m_category.html)
// ==========================================
async function loadCategoryListPage() {
  const container = document.getElementById("mobile-category-container");
  if (!container) return;

  try {
    mobileCategories = await ThosbookAPI.getCategories();

    if (!Array.isArray(mobileCategories) || mobileCategories.length === 0) {
      container.innerHTML = `<div class="text-center py-8 text-gray-400 text-sm">ไม่พบหมวดหมู่</div>`;
      return;
    }

    let categoriesHtml = "";
    const iconList = ["heart", "command", "box", "folder", "star", "bookmark", "tag"];

    mobileCategories.forEach((cat, index) => {
      const iconName = iconList[index % iconList.length];
      const encodedName = encodeURIComponent(cat.name);

      categoriesHtml += `
        <a href="m_category_detail.html?id=${cat.id}&name=${encodedName}" class="flex items-center justify-between py-3.5 px-2 hover:bg-gray-50 rounded-2xl transition-colors w-full">
          <div class="flex items-center gap-4">
            <i data-lucide="${iconName}" class="w-6 h-6" style="color: ${cat.color || '#0c3d88'}"></i>
            <span class="text-lg font-semibold text-brand-darkNavy">${cat.name}</span>
          </div>
          <i data-lucide="chevron-right" class="w-5 h-5 text-brand-darkNavy"></i>
        </a>
      `;
    });

    if (ThosbookAuth.isAdmin()) {
      categoriesHtml += `
        <button onclick="openCategoryModal()" class="w-full flex items-center gap-3 bg-[#eef1f5] hover:bg-gray-200 text-brand-darkNavy p-4 rounded-2xl font-semibold text-base transition-colors mt-2">
          <i data-lucide="plus-circle" class="w-6 h-6 text-brand-darkNavy"></i>
          <span>New Category</span>
        </button>
      `;
    }

    container.innerHTML = categoriesHtml;
    if (window.lucide) lucide.createIcons();
  } catch (error) {
    console.error("Error loading categories:", error);
    container.innerHTML = `<div class="text-center py-8 text-red-500 text-sm">เกิดข้อผิดพลาดในการโหลดหมวดหมู่</div>`;
  }
}

// ==========================================
// 📱 PAGE 3: CATEGORY DETAIL (m_category_detail.html)
// ==========================================
async function loadCategoryDetailPage() {
  const container = document.getElementById("mobile-bookmark-list-container");
  const titleEl = document.getElementById("category-title");

  const urlParams = new URLSearchParams(window.location.search);
  const catId = urlParams.get("id");
  const catName = urlParams.get("name");

  if (catName && titleEl) {
    titleEl.innerText = decodeURIComponent(catName);
  }

  if (!container) return;

  try {
    const allBookmarks = await ThosbookAPI.getBookmarks();
    mobileBookmarks = allBookmarks.filter(bm => String(bm.category_id) === String(catId));

    if (!Array.isArray(mobileBookmarks) || mobileBookmarks.length === 0) {
      container.innerHTML = `<div class="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">ไม่มีข้อมูลในหมวดหมู่นี้</div>`;
      return;
    }

    renderBookmarkCards(mobileBookmarks, container);
  } catch (error) {
    console.error("Error loading category bookmarks:", error);
    container.innerHTML = `<div class="bg-white rounded-3xl p-8 text-center text-red-500 text-sm shadow-sm border border-gray-100">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
  }
}

// ==========================================
// 🛠️ CATEGORY MODAL HANDLERS
// ==========================================
function openCategoryModal() {
  const modal = document.getElementById("category-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeCategoryModal() {
  const modal = document.getElementById("category-modal");
  if (modal) modal.classList.add("hidden");
}

async function handleSaveCategory(e) {
  e.preventDefault();
  const nameInput = document.getElementById("cat-name");
  const colorInput = document.getElementById("cat-color");

  if (!nameInput) return;

  const payload = {
    id: "cat_" + Date.now(),
    name: nameInput.value.trim(),
    color: colorInput ? colorInput.value : "#0c3d88"
  };

  try {
    await ThosbookAPI.addCategory(payload);
    closeCategoryModal();
    loadCategoryListPage();
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการบันทึกหมวดหมู่");
  }
}