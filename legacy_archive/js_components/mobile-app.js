/**
 * Thosbook - Mobile UI Controller (Optimized with Instant Cache & Unified API Schema)
 * File: js/components/mobile-app.js
 */

import ThosbookAPI from '../core/api.js';

let mobileCategories = [];
let mobileBookmarks = [];

const CACHE_KEY_DASHBOARD = 'thosbook_cache_dashboard';
const CACHE_KEY_CAT = 'thosbook_cache_categories';
const CACHE_KEY_BM = 'thosbook_cache_bookmarks';

// --- INITIALIZE MOBILE APP ---
document.addEventListener("DOMContentLoaded", () => {
  if (typeof ThosbookAuth !== "undefined" && ThosbookAuth.requireAuth) {
    ThosbookAuth.requireAuth();
  }
  
  renderHeaderProfile();

  if (window.lucide) lucide.createIcons();

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
  const user = (typeof ThosbookAuth !== "undefined" && ThosbookAuth.getUser) 
    ? ThosbookAuth.getUser() 
    : JSON.parse(localStorage.getItem("thosbook_user") || "{}");

  if (!user) return;

  const nameEl = document.getElementById("header-user-name");
  const roleEl = document.getElementById("header-user-role");

  if (nameEl) nameEl.innerText = user.name || user.username || "User";
  if (roleEl) roleEl.innerText = user.role || "viewer";
}

function handleLogout() {
  if (typeof ThosbookAuth !== "undefined") ThosbookAuth.logout();
}

// ==========================================
// 📱 PAGE 1: HOME DASHBOARD (m_dashboard.html)
// ==========================================
async function loadDashboardPage() {
  const container = document.getElementById('mobile-bookmark-list-container') || document.getElementById('dashboard-container');

  // 1. Instant Render จาก Cache (0ms)
  const cachedData = localStorage.getItem(CACHE_KEY_DASHBOARD);
  if (cachedData) {
    try {
      const parsed = JSON.parse(cachedData);
      mobileCategories = parsed.categories || [];
      mobileBookmarks = parsed.bookmarks || [];
      renderDashboardUI(mobileCategories, mobileBookmarks);
    } catch (e) {
      console.error('Dashboard Cache Error:', e);
    }
  }

  // 2. Background Fetch ดึงข้อมูลล่าสุดผ่าน Centralized API (แชร์ Logic เดียวกับ Desktop)
  const response = await ThosbookAPI.getNormalizedDashboardData();

  if (response.success) {
    mobileCategories = response.data.categories || [];
    mobileBookmarks = response.data.bookmarks || response.data.recentActivities || [];

    // อัปเดต Cache
    localStorage.setItem(CACHE_KEY_DASHBOARD, JSON.stringify({ 
      categories: mobileCategories, 
      bookmarks: mobileBookmarks 
    }));
    
    // Render UI ใหม่
    renderDashboardUI(mobileCategories, mobileBookmarks);
  } else if (!cachedData && container) {
    container.innerHTML = `<div class="text-center py-8 text-[#fe0001] text-sm">${response.error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'}</div>`;
  }
}

// ฟังก์ชัน Render Dashboard UI
function renderDashboardUI(categories, bookmarks) {
  const container = document.getElementById('mobile-bookmark-list-container') || document.getElementById('dashboard-container');
  if (!container) return;

  if (!bookmarks || bookmarks.length === 0) {
    container.innerHTML = `<div class="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">ยังไม่มี Bookmark ในระบบ</div>`;
    return;
  }

  renderBookmarkCards(bookmarks, container);
}

// 🔍 MOBILE SEARCH HANDLER
function handleMobileSearch() {
  const queryInput = document.getElementById("mobile-search-input");
  if (!queryInput) return;

  const query = queryInput.value.trim().toLowerCase();
  const container = document.getElementById("mobile-bookmark-list-container");
  if (!container) return;

  if (query === "") {
    renderBookmarkCards(mobileBookmarks, container);
    return;
  }

  const filtered = mobileBookmarks.filter(item => {
    const matchTitle = item.title && item.title.toLowerCase().includes(query);
    const matchContent = item.content && item.content.toLowerCase().includes(query);
    const matchUrl = item.url && item.url.toLowerCase().includes(query);
    return matchTitle || matchContent || matchUrl;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">ไม่พบผลการค้นหา "${query}"</div>`;
    return;
  }

  renderBookmarkCards(filtered, container);
}

// Helper ฟังก์ชันสำหรับ Render Cards บุ๊กมาร์ก
function renderBookmarkCards(items, container) {
  if (!container) return;
  container.innerHTML = "";

  items.forEach(bm => {
    const cat = mobileCategories.find(c => String(c.id) === String(bm.category_id));
    const catName = cat ? cat.name : (bm.type || "General");

    const imgVal = bm.image || bm.image_url;
    const hasValidImage = imgVal && String(imgVal).trim() !== "" && String(imgVal) !== "undefined";

    const imageHtml = hasValidImage ? `
      <div class="mb-3 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
        <img 
          src="${imgVal}" 
          alt="${bm.title || 'Bookmark Image'}" 
          class="w-full h-40 object-cover" 
          onerror="this.parentElement.style.display='none'"
        />
      </div>
    ` : '';

    const linkHtml = bm.url && bm.url !== '#' ? `
      <div class="pt-1">
        <a href="${bm.url}" target="_blank" class="text-xs text-brand-navy underline inline-block font-semibold hover:text-blue-900">เปิดลิงก์ ↗</a>
      </div>
    ` : '';

    container.innerHTML += `
      <div class="bg-white rounded-3xl p-5 shadow-sm space-y-2 border border-gray-100 w-full">
        <span class="text-xs font-semibold text-brand-navy block">${catName}</span>
        ${imageHtml}
        <h3 class="font-bold text-base text-brand-darkNavy">${bm.title || 'ไม่มีหัวข้อ'}</h3>
        ${bm.content ? `<p class="text-xs text-gray-500 leading-relaxed">${bm.content}</p>` : ''}
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
  const container = document.getElementById("mobile-category-container") || document.getElementById("category-list-container");
  if (!container) return;

  // 1. Instant Cache Render
  const cachedCat = localStorage.getItem(CACHE_KEY_CAT);
  if (cachedCat) {
    try {
      mobileCategories = JSON.parse(cachedCat);
      renderCategoryListUI(mobileCategories, container);
    } catch (e) {
      console.error('Read Category Cache Error:', e);
    }
  }

  // 2. Fetch API Sync ผ่าน Centralized Service
  const res = await ThosbookAPI.getFormattedCategories();

  if (res.success && Array.isArray(res.data) && res.data.length > 0) {
    mobileCategories = res.data;
    localStorage.setItem(CACHE_KEY_CAT, JSON.stringify(res.data));
    renderCategoryListUI(res.data, container);
  } else if (!cachedCat) {
    container.innerHTML = `<div class="text-center py-8 text-[#fe0001] text-sm">${res.error || 'เกิดข้อผิดพลาดในการโหลดหมวดหมู่'}</div>`;
  }
}

function renderCategoryListUI(categories, container) {
  let categoriesHtml = "";

  categories.forEach((cat) => {
    const iconName = cat.icon || "folder";
    const catId = cat.id || encodeURIComponent(cat.name);

    categoriesHtml += `
      <a href="m_category_detail.html?cat=${catId}" class="flex items-center justify-between p-3.5 hover:bg-gray-50 rounded-2xl transition-colors w-full">
        <div class="flex items-center gap-3">
          <i data-lucide="${iconName}" class="w-5 h-5 text-brand-navy"></i>
          <span class="font-medium text-brand-darkNavy text-sm">${cat.name}</span>
        </div>
        <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
      </a>
    `;
  });

  container.innerHTML = categoriesHtml;
  if (window.lucide) lucide.createIcons();
}

// ==========================================
// 📱 PAGE 3: CATEGORY DETAIL (m_category_detail.html)
// ==========================================
async function loadCategoryDetailPage() {
  const container = document.getElementById("mobile-bookmark-list-container") || document.getElementById("bookmark-list-container");
  const titleEl = document.getElementById("category-title-header") || document.getElementById("category-title");

  const urlParams = new URLSearchParams(window.location.search);
  const catParam = urlParams.get("cat") || urlParams.get("cat_id") || urlParams.get("id");

  if (!container) return;

  if (!catParam) {
    container.innerHTML = `<div class="text-center py-10 text-gray-400 text-sm">ไม่พบรหัสหมวดหมู่ที่ระบุ</div>`;
    return;
  }

  // 1. Instant Cache Render
  const cachedCat = localStorage.getItem(CACHE_KEY_CAT);
  const cachedBM = localStorage.getItem(CACHE_KEY_BM);
  if (cachedCat && cachedBM) {
    try {
      mobileCategories = JSON.parse(cachedCat);
      const allBM = JSON.parse(cachedBM);
      processCategoryDetail(catParam, mobileCategories, allBM, container, titleEl);
    } catch (e) {
      console.error('Read Category Detail Cache Error:', e);
    }
  }

  // 2. API Sync
  const [catRes, bmRes] = await Promise.all([
    ThosbookAPI.getCategories(),
    ThosbookAPI.getBookmarks()
  ]);

  if (catRes.success) {
    mobileCategories = Array.isArray(catRes.data) ? catRes.data : [];
    if (mobileCategories.length > 0) localStorage.setItem(CACHE_KEY_CAT, JSON.stringify(mobileCategories));
  }

  const allBookmarks = (bmRes.success && Array.isArray(bmRes.data)) ? bmRes.data : [];
  if (allBookmarks.length > 0) localStorage.setItem(CACHE_KEY_BM, JSON.stringify(allBookmarks));

  if (catRes.success || bmRes.success) {
    processCategoryDetail(catParam, mobileCategories, allBookmarks, container, titleEl);
  } else if (!cachedBM) {
    container.innerHTML = `<div class="text-center py-10 text-[#fe0001] text-sm">${bmRes.error || catRes.error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'}</div>`;
  }
}

function processCategoryDetail(catParam, categories, allBookmarks, container, titleEl) {
  const currentCat = categories.find(c => 
    String(c.id) === String(catParam) || 
    String(c.name).toLowerCase() === String(catParam).toLowerCase()
  );

  if (titleEl) {
    titleEl.innerText = currentCat ? currentCat.name : decodeURIComponent(catParam);
  }

  const filteredBookmarks = allBookmarks.filter(bm => 
    String(bm.category_id) === String(catParam) || 
    (currentCat && String(bm.category_id) === String(currentCat.id))
  );

  if (filteredBookmarks.length === 0) {
    container.innerHTML = `<div class="bg-white rounded-3xl p-8 text-center text-gray-400 text-sm shadow-sm border border-gray-100">ไม่มีข้อมูลในหมวดหมู่นี้</div>`;
    return;
  }

  renderBookmarkCards(filteredBookmarks, container);
}

// ==========================================
// 🛠️ BOOKMARK & CATEGORY MODAL HANDLERS
// ==========================================
async function handleSaveBookmark(e) {
  e.preventDefault();
  const btn = document.getElementById("save-bm-btn");
  if (btn) {
    btn.disabled = true;
    btn.innerText = "กำลังบันทึก...";
  }

  const payload = {
    category_id: document.getElementById("bm-category").value,
    type: document.getElementById("bm-type").value,
    title: document.getElementById("bm-title").value.trim(),
    content: document.getElementById("bm-content").value.trim(),
    image: typeof currentUploadedImageData !== "undefined" ? currentUploadedImageData : "",
    url: document.getElementById("bm-url").value.trim()
  };

  try {
    const res = await ThosbookAPI.addBookmark(payload);

    if (res.success) {
      if (typeof ThosbookUI !== "undefined") {
        ThosbookUI.success("บันทึกเรียบร้อย");
      }
      localStorage.removeItem(CACHE_KEY_DASHBOARD);
      localStorage.removeItem(CACHE_KEY_BM);
      loadDashboardPage();
    } else {
      if (typeof ThosbookUI !== "undefined") {
        ThosbookUI.error(res.error || "ไม่สามารถบันทึกได้");
      }
    }
  } catch (err) {
    console.error("Save Bookmark Error:", err);
    if (typeof ThosbookUI !== "undefined") {
      ThosbookUI.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Save";
    }
  }
}