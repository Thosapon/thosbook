/**
 * Thosbook - Desktop Dashboard Logic
 * File: app.js
 */

import ThosbookAPI from './js/core/api.js';

let isCollapsed = false;
let allBookmarks = [];
let cachedCategories = [];
let currentCategory = 'all';
let uploadedImageBase64 = "";

document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) {
    lucide.createIcons();
  }
  fetchCategories();
  fetchBookmarkData();
});

// --- CENTRALIZED DASHBOARD DATA FETCHING ---

async function loadDashboard() {
  showLoading(true);
  
  // เรียกใช้ Centralized Service จาก ThosbookAPI
  const response = await ThosbookAPI.getNormalizedDashboardData();
  
  showLoading(false);
  if (!response.success) {
    showErrorAlert(response.error);
    return;
  }

  const { stats, recentActivities } = response.data;
  renderStats(stats);
  renderRecentActivities(recentActivities);
}

// --- CATEGORIES & BOOKMARKS FETCHING ---

async function fetchCategories() {
  const navContainer = document.getElementById("category-nav");
  if (!navContainer) return;

  const response = await ThosbookAPI.getFormattedCategories();
  if (!response.success) {
    console.error("Error fetching categories:", response.error);
    return;
  }

  cachedCategories = response.data;

  let allItemsHtml = `
    <a href="#" onclick="filterByCategory('all', this)" class="nav-icon-only hidden justify-center items-center text-brand-darkNavy bg-brand-accentOrange p-2.5 rounded-xl font-medium text-sm transition-colors mb-2">
      <i data-lucide="layout-grid" class="w-5 h-5"></i>
    </a>
    <button onclick="filterByCategory('all', this)" class="category-btn nav-text w-full flex items-center gap-3 bg-brand-accentOrange text-brand-darkNavy px-4 py-2.5 rounded-xl font-semibold text-sm mb-1">
      <i data-lucide="layout-grid" class="w-4 h-4 shrink-0"></i>
      <span class="truncate">All Items</span>
    </button>
  `;

  let categoriesHtml = "";
  if (Array.isArray(cachedCategories)) {
    cachedCategories.forEach((cat) => {
      categoriesHtml += `
        <div class="flex items-center justify-between rounded-xl hover:bg-gray-50 pr-2">
          <button onclick="filterByCategory('${cat.id}', this)" 
             class="category-btn nav-item flex-1 flex items-center gap-3 text-brand-darkNavy px-4 py-2.5 font-medium text-sm transition-colors text-left">
            <i data-lucide="folder" class="w-5 h-5 shrink-0" style="color: ${cat.color || 'inherit'}"></i>
            <span class="nav-text truncate">${cat.name}</span>
          </button>
        </div>
      `;
    });
  }

  navContainer.innerHTML = allItemsHtml + categoriesHtml;
  populateCategoryDropdown(cachedCategories);
  if (window.lucide) lucide.createIcons();
}

async function fetchBookmarkData() {
  const container = document.getElementById('cards-container');

  const response = await ThosbookAPI.getBookmarks();
  if (!response.success) {
    console.error("Error fetching bookmarks:", response.error);
    if (container) {
      container.innerHTML = `<div class="col-span-full text-center py-12 text-red-500 font-medium">${response.error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล'}</div>`;
    }
    return;
  }

  allBookmarks = Array.isArray(response.data) ? response.data : [];
  renderBookmarks(allBookmarks);
}

// --- RENDERING & UI HELPERS ---

function renderBookmarks(data) {
  const container = document.getElementById('cards-container');
  if (!container) return;

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">ไม่พบข้อมูล Bookmark</div>`;
    return;
  }

  container.innerHTML = "";
  data.forEach((item) => {
    let typeLabel = item.type === "text" ? "Text / Note" : (item.type === "video" ? "Video" : "Link");

    const imageHtml = item.image_url ? `
      <div class="relative group/img mb-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img 
          src="${item.image_url}" 
          alt="${item.title}" 
          onclick="openImageLightbox('${item.image_url}', '${item.title || 'Image Preview'}')" 
          class="w-full h-40 object-cover cursor-pointer transition-transform duration-300 group-hover/img:scale-105" 
        />
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 pointer-events-none">
          <button 
            onclick="openImageLightbox('${item.image_url}', '${item.title || 'Image Preview'}')" 
            class="pointer-events-auto bg-white/90 hover:bg-white text-brand-darkNavy p-2 rounded-xl shadow-md transition-all hover:scale-110" 
            title="View Large Image">
            <i data-lucide="maximize-2" class="w-4 h-4"></i>
          </button>
          <a 
            href="${item.image_url}" 
            download="${(item.title || 'bookmark-image').replace(/[^a-zA-Z0-9]/g, '_')}.jpg" 
            class="pointer-events-auto bg-white/90 hover:bg-white text-brand-darkNavy p-2 rounded-xl shadow-md transition-all hover:scale-110" 
            title="Download Image">
            <i data-lucide="download" class="w-4 h-4"></i>
          </a>
        </div>
      </div>
    ` : '';

    const cardHtml = `
      <div class="bg-white rounded-2xl p-6 shadow-sm min-h-[180px] flex flex-col justify-between hover:shadow-md transition-shadow relative group">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-accentOrange text-brand-darkNavy inline-block">
              ${typeLabel}
            </span>
          </div>
          ${imageHtml}
          <h3 class="text-base font-semibold text-brand-darkNavy line-clamp-2">${item.title || 'ไม่มีหัวข้อ'}</h3>
          <p class="text-sm text-gray-600 mt-2 line-clamp-3">${item.content || ''}</p>
        </div>
        <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-medium text-brand-darkNavy">
          <span>${item.url ? new URL(item.url).hostname : ''}</span>
          ${item.url ? `<a href="${item.url}" target="_blank" class="text-brand-navy hover:underline">เปิดลิงก์ ↗</a>` : ''}
        </div>
      </div>
    `;
    container.insertAdjacentHTML("beforeend", cardHtml);
  });
  if (window.lucide) lucide.createIcons();
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const navTexts = document.querySelectorAll('.nav-text');
  const navItems = document.querySelectorAll('.nav-item');
  const navIconOnly = document.querySelector('.nav-icon-only');

  isCollapsed = !isCollapsed;

  if (isCollapsed) {
    sidebar.classList.remove('w-64', 'p-4');
    sidebar.classList.add('w-16', 'p-2');
    navTexts.forEach(el => el.classList.add('hidden'));
    navItems.forEach(el => {
      el.classList.remove('px-4');
      el.classList.add('justify-center', 'px-2');
    });
    if (navIconOnly) navIconOnly.classList.replace('hidden', 'flex');
  } else {
    sidebar.classList.remove('w-16', 'p-2');
    sidebar.classList.add('w-64', 'p-4');
    navTexts.forEach(el => el.classList.remove('hidden'));
    navItems.forEach(el => {
      el.classList.remove('justify-center', 'px-2');
      el.classList.add('px-4');
    });
    if (navIconOnly) navIconOnly.classList.replace('flex', 'hidden');
  }
}

function filterByCategory(catId, element) {
  currentCategory = catId;
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.classList.remove('bg-brand-accentOrange', 'font-semibold');
    btn.classList.add('hover:bg-gray-50', 'font-medium');
  });
  if (element) {
    element.classList.remove('hover:bg-gray-50', 'font-medium');
    element.classList.add('bg-brand-accentOrange', 'font-semibold');
  }
  applyFilters();
}

function handleSearch() { applyFilters(); }

function applyFilters() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();

  const filtered = allBookmarks.filter(item => {
    const matchCategory = (currentCategory === 'all') || (item.category_id === currentCategory);
    const matchTitle = item.title && item.title.toLowerCase().includes(query);
    const matchContent = item.content && item.content.toLowerCase().includes(query);
    const matchUrl = item.url && item.url.toLowerCase().includes(query);
    
    return matchCategory && (query === "" || matchTitle || matchContent || matchUrl);
  });

  renderBookmarks(filtered);
}

function populateCategoryDropdown(categories) {
  const select = document.getElementById("bm-category");
  if (!select || !Array.isArray(categories)) return;
  select.innerHTML = '<option value="">-- เลือกหมวดหมู่ --</option>';
  categories.forEach(cat => {
    select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
  });
}

function compressImage(file, maxWidth = 1000, quality = 0.7) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

async function previewAddImage(event) {
  const file = event.target.files[0];
  if (!file) return;
  try {
    uploadedImageBase64 = await compressImage(file, 1000, 0.7);
    const previewImg = document.getElementById("image-preview");
    const container = document.getElementById("image-preview-container");
    previewImg.src = uploadedImageBase64;
    container.classList.remove("hidden");
  } catch (err) {
    console.error(err);
  }
}

function openImageLightbox(imageUrl, title) {
  if (!imageUrl) return;
  const modal = document.getElementById("image-lightbox-modal");
  document.getElementById("lightbox-img").src = imageUrl;
  document.getElementById("lightbox-title").innerText = title || "Image Preview";
  document.getElementById("lightbox-download-btn").href = imageUrl;
  modal.classList.remove("hidden");
  if (window.lucide) lucide.createIcons();
}

function closeImageLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('button')) return;
  document.getElementById("image-lightbox-modal").classList.add("hidden");
}

function showErrorNotification(title, message) {
  document.getElementById("notify-title").innerText = title;
  document.getElementById("notify-message").innerText = message;
  document.getElementById("notify-modal").classList.remove("hidden");
}

function closeNotifyModal() { document.getElementById("notify-modal").classList.add("hidden"); }

function openCategoryModal() {
  document.getElementById("cat-id").value = "";
  document.getElementById("cat-name").value = "";
  document.getElementById("cat-color").value = "#0c3d88";
  document.getElementById("cat-modal-title").innerText = "New Category";
  document.getElementById("category-modal").classList.remove("hidden");
}

function closeCategoryModal() {
  document.getElementById("category-modal").classList.add("hidden");
  document.getElementById("category-form").reset();
}

function openAddModal() {
  document.getElementById("add-modal").classList.remove("hidden");
  populateCategoryDropdown(cachedCategories);
}

function closeAddModal() {
  document.getElementById("add-modal").classList.add("hidden");
  document.getElementById("add-bookmark-form").reset();
  document.getElementById("image-preview-container").classList.add("hidden");
  uploadedImageBase64 = "";
}

// --- FORM HANDLING WITH CENTRALIZED API ---

async function handleSaveCategory(e) {
  e.preventDefault();
  const saveBtn = document.getElementById("save-cat-btn");
  saveBtn.disabled = true;

  const catId = document.getElementById("cat-id").value;
  const isEdit = Boolean(catId);

  const categoryData = {
    id: isEdit ? catId : "cat_" + Date.now(),
    name: document.getElementById("cat-name").value,
    color: document.getElementById("cat-color").value
  };

  const response = isEdit 
    ? await ThosbookAPI.updateCategory(catId, categoryData)
    : await ThosbookAPI.addCategory(categoryData);

  if (response.success) {
    closeCategoryModal();
    fetchCategories();
  } else {
    showErrorNotification("Error", response.error || "บันทึกข้อมูลไม่สำเร็จ");
  }
  
  saveBtn.disabled = false;
}

async function handleAddBookmark(e) {
  e.preventDefault();
  const saveBtn = document.getElementById("save-bm-btn");
  saveBtn.disabled = true;

  const bookmarkData = {
    id: "bm_" + Date.now(),
    category_id: document.getElementById("bm-category").value,
    type: document.getElementById("bm-type").value,
    title: document.getElementById("bm-title").value,
    url: document.getElementById("bm-url").value,
    content: document.getElementById("bm-content").value,
    image_url: uploadedImageBase64
  };

  const response = await ThosbookAPI.addBookmark(bookmarkData);

  if (response.success) {
    closeAddModal();
    fetchBookmarkData();
  } else {
    showErrorNotification("Error", response.error || "บันทึกข้อมูลไม่สำเร็จ");
  }

  saveBtn.disabled = false;
}

// Export Functions ให้ HTML Inline Events เรียกใช้งานได้เมื่อใช้ ES Modules
window.filterByCategory = filterByCategory;
window.handleSearch = handleSearch;
window.toggleSidebar = toggleSidebar;
window.openCategoryModal = openCategoryModal;
window.closeCategoryModal = closeCategoryModal;
window.handleSaveCategory = handleSaveCategory;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.handleAddBookmark = handleAddBookmark;
window.previewAddImage = previewAddImage;
window.openImageLightbox = openImageLightbox;
window.closeImageLightbox = closeImageLightbox;
window.closeNotifyModal = closeNotifyModal;