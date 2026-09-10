/**
 * Thosbook - Mobile UI Controller (Updated Schema & ThosbookUI)
 */

let mobileCategories = [];
let mobileBookmarks = [];

// --- INITIALIZE MOBILE APP ---
document.addEventListener("DOMContentLoaded", () => {
  ThosbookAuth.requireAuth();
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
  const user = ThosbookAuth.getUser();
  if (!user) return;

  const nameEl = document.getElementById("header-user-name");
  const roleEl = document.getElementById("header-user-role");

  if (nameEl) nameEl.innerText = user.name || user.username || "User";
  if (roleEl) roleEl.innerText = user.role || "viewer";
}

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

// 🔍 MOBILE SEARCH HANDLER
function handleMobileSearch() {
  const query = document.getElementById("mobile-search-input").value.trim().toLowerCase();
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
  container.innerHTML = "";

  items.forEach(bm => {
    const cat = mobileCategories.find(c => String(c.id) === String(bm.category_id));
    const catName = cat ? cat.name : "General";

    // รองรับทั้งคอลัมน์ชื่อใหม่ 'image' และชื่อเดิม 'image_url'
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
// 🛠️ BOOKMARK MODAL HANDLERS (MOBILE SHEET)
// ==========================================
function openAddBookmarkModal() {
  const modal = document.getElementById("bookmark-modal");
  const select = document.getElementById("bm-category");

  if (select && Array.isArray(mobileCategories)) {
    select.innerHTML = '<option value="">-- เลือกหมวดหมู่ --</option>';
    mobileCategories.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  }

  if (modal) modal.classList.remove("hidden");
}

function closeAddBookmarkModal() {
  const modal = document.getElementById("bookmark-modal");
  if (modal) modal.classList.add("hidden");
}

async function handleSaveBookmark(e) {
  e.preventDefault();
  const btn = document.getElementById("save-bm-btn");
  if (btn) {
    btn.disabled = true;
    btn.innerText = "กำลังบันทึก...";
  }

  const payload = {
    id: "bm_" + Date.now(),
    category_id: document.getElementById("bm-category").value,
    type: document.getElementById("bm-type").value,
    title: document.getElementById("bm-title").value.trim(),
    content: document.getElementById("bm-content").value.trim(),
    image: typeof currentUploadedImageData !== "undefined" ? currentUploadedImageData : "",
    url: document.getElementById("bm-url").value.trim()
  };

  try {
    const res = await ThosbookAPI.addBookmark(payload);
    if (res && res.success) {
      if (typeof ThosbookUI !== "undefined") {
        ThosbookUI.success("สำเร็จ", "เพิ่ม Bookmark เรียบร้อย");
      }
      closeAddBookmarkModal();
      loadDashboardPage();
    } else {
      if (typeof ThosbookUI !== "undefined") {
        ThosbookUI.alert("เกิดข้อผิดพลาด", res.message || "ไม่สามารถบันทึกได้", "error");
      }
    }
  } catch (err) {
    console.error("Save Bookmark Error:", err);
    if (typeof ThosbookUI !== "undefined") {
      ThosbookUI.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึก Bookmark", "error");
    }
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerText = "Save";
    }
  }
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
    const [categories, allBookmarks] = await Promise.all([
      ThosbookAPI.getCategories(),
      ThosbookAPI.getBookmarks()
    ]);

    mobileCategories = categories;
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
    const res = await ThosbookAPI.addCategory(payload);
    if (res && res.success) {
      if (typeof ThosbookUI !== "undefined") {
        ThosbookUI.success("สำเร็จ", "เพิ่มหมวดหมู่เรียบร้อย");
      }
      closeCategoryModal();
      loadCategoryListPage();
    } else {
      if (typeof ThosbookUI !== "undefined") {
        ThosbookUI.alert("เกิดข้อผิดพลาด", res.message || "ไม่สามารถบันทึกได้", "error");
      }
    }
  } catch (err) {
    console.error("Save Category Error:", err);
    if (typeof ThosbookUI !== "undefined") {
      ThosbookUI.alert("ข้อผิดพลาด", "เกิดข้อผิดพลาดในการบันทึกหมวดหมู่", "error");
    }
  }
}