let isCollapsed = false;
let allBookmarks = [];
let cachedCategories = [];
let currentCategory = 'all';
let pendingDeleteId = null;
let pendingDeleteCatId = null;
let uploadedImageBase64 = "";
let editUploadedImageBase64 = "";

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  fetchCategories();
  fetchBookmarkData();
});

// --- SIDEBAR HANDLER ---
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

// --- DATA FETCHING ---
async function fetchCategories() {
  const navContainer = document.getElementById("category-nav");
  if (!navContainer) return;

  try {
    const response = await fetch(`${GAS_API_URL}?action=getCategories`);
    cachedCategories = await response.json();

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
        const catJson = JSON.stringify(cat).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
        categoriesHtml += `
          <div class="group/cat flex items-center justify-between rounded-xl hover:bg-gray-50 pr-2">
            <button onclick="filterByCategory('${cat.id}', this)" 
               class="category-btn nav-item flex-1 flex items-center gap-3 text-brand-darkNavy px-4 py-2.5 font-medium text-sm transition-colors text-left">
              <i data-lucide="folder" class="w-5 h-5 shrink-0" style="color: ${cat.color || 'inherit'}"></i>
              <span class="nav-text truncate">${cat.name}</span>
            </button>
            <div class="hidden group-hover/cat:flex items-center gap-1 nav-text">
              <button onclick='openCategoryModal(${catJson})' class="p-1 text-gray-400 hover:text-brand-navy rounded-md" title="Edit Category">
                <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
              </button>
              <button onclick="handleDeleteCategory('${cat.id}')" class="p-1 text-gray-400 hover:text-red-500 rounded-md" title="Delete Category">
                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              </button>
            </div>
          </div>
        `;
      });
    }

    navContainer.innerHTML = allItemsHtml + categoriesHtml;
    populateCategoryDropdown(cachedCategories);
    lucide.createIcons();
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
}

async function fetchBookmarkData() {
  const container = document.getElementById('cards-container');

  try {
    const response = await fetch(`${GAS_API_URL}?action=getBookmarks`);
    allBookmarks = await response.json();
    renderBookmarks(allBookmarks);
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    container.innerHTML = `<div class="col-span-full text-center py-12 text-red-500 font-medium">เกิดข้อผิดพลาดในการโหลดข้อมูล</div>`;
  }
}

// --- CARDS RENDERER ---
function renderBookmarks(data) {
  const container = document.getElementById('cards-container');
  if (!container) return;

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">ไม่พบข้อมูล Bookmark</div>`;
    return;
  }

  container.innerHTML = "";
  data.forEach((item) => {
    const itemJson = JSON.stringify(item).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

    // แปลง Label Text ตามเงื่อนไขข้อ 2
    let typeLabel = "Link";
    if (item.type === "text") {
      typeLabel = "Text / Note";
    } else if (item.type === "video") {
      typeLabel = "Video";
    } else if (item.type === "link") {
      typeLabel = "Link";
    } else if (item.type) {
      typeLabel = item.type;
    }

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
            <div class="flex items-center gap-1">
              <button onclick='openEditModal(${itemJson})' class="p-1.5 text-gray-400 hover:text-brand-navy rounded-lg hover:bg-gray-100 transition-colors" title="Edit">
                <i data-lucide="pencil" class="w-4 h-4"></i>
              </button>
              <button onclick="handleDeleteBookmark('${item.id}')" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors" title="Delete">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            </div>
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
  lucide.createIcons();
}

// --- SEARCH & FILTER (ปรับปรุงข้อ 1) ---
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

function handleSearch() { 
  applyFilters(); 
}

function applyFilters() {
  const query = document.getElementById('search-input').value.trim().toLowerCase();

  const filtered = allBookmarks.filter(item => {
    const matchCategory = (currentCategory === 'all') || (item.category_id === currentCategory);
    
    // Search ใน title, content, และ url
    const matchTitle = item.title && item.title.toLowerCase().includes(query);
    const matchContent = item.content && item.content.toLowerCase().includes(query);
    const matchUrl = item.url && item.url.toLowerCase().includes(query);
    
    const matchSearch = query === "" || matchTitle || matchContent || matchUrl;

    return matchCategory && matchSearch;
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

// --- IMAGE COMPRESSION & PREVIEW ---
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
    console.error("Error compressing image:", err);
  }
}

async function previewEditImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  try {
    editUploadedImageBase64 = await compressImage(file, 1000, 0.7);
    const previewImg = document.getElementById("edit-image-preview");
    const container = document.getElementById("edit-image-preview-container");
    previewImg.src = editUploadedImageBase64;
    container.classList.remove("hidden");
  } catch (err) {
    console.error("Error compressing image:", err);
  }
}

// --- LIGHTBOX PREVIEW ---
function openImageLightbox(imageUrl, title) {
  if (!imageUrl) return;
  const modal = document.getElementById("image-lightbox-modal");
  const img = document.getElementById("lightbox-img");
  const titleEl = document.getElementById("lightbox-title");
  const downloadBtn = document.getElementById("lightbox-download-btn");

  img.src = imageUrl;
  titleEl.innerText = title || "Image Preview";
  downloadBtn.href = imageUrl;
  downloadBtn.setAttribute("download", (title || 'bookmark-image').replace(/[^a-zA-Z0-9]/g, '_') + '.jpg');

  modal.classList.remove("hidden");
  lucide.createIcons();
}

function openLightboxFromPreview(imgElementId, defaultTitle) {
  const imgSrc = document.getElementById(imgElementId).src;
  if (imgSrc) openImageLightbox(imgSrc, defaultTitle);
}

function closeImageLightbox(e) {
  if (e && e.target !== e.currentTarget && !e.target.closest('button')) return;
  document.getElementById("image-lightbox-modal").classList.add("hidden");
  document.getElementById("lightbox-img").src = "";
}

// --- ERROR NOTIFICATION ONLY ---
function showErrorNotification(title, message) {
  const modal = document.getElementById("notify-modal");
  document.getElementById("notify-title").innerText = title;
  document.getElementById("notify-message").innerText = message;
  lucide.createIcons();
  modal.classList.remove("hidden");
}

function closeNotifyModal() { document.getElementById("notify-modal").classList.add("hidden"); }

// --- CATEGORY MODAL HANDLERS ---
function openCategoryModal(cat = null) {
  const modal = document.getElementById("category-modal");
  const title = document.getElementById("cat-modal-title");
  const catIdInput = document.getElementById("cat-id");
  const catNameInput = document.getElementById("cat-name");
  const catColorInput = document.getElementById("cat-color");

  if (cat) {
    title.innerText = "Edit Category";
    catIdInput.value = cat.id;
    catNameInput.value = cat.name;
    catColorInput.value = cat.color || "#0c3d88";
  } else {
    title.innerText = "New Category";
    catIdInput.value = "";
    catNameInput.value = "";
    catColorInput.value = "#0c3d88";
  }

  modal.classList.remove("hidden");
}

function closeCategoryModal() {
  document.getElementById("category-modal").classList.add("hidden");
  document.getElementById("category-form").reset();
}

async function handleSaveCategory(e) {
  e.preventDefault();
  const saveBtn = document.getElementById("save-cat-btn");
  saveBtn.disabled = true;
  saveBtn.innerText = "Saving...";

  const catId = document.getElementById("cat-id").value;
  const isEdit = Boolean(catId);

  const payload = {
    action: isEdit ? "updateCategory" : "addCategory",
    id: catId || undefined,
    data: {
      id: catId || "cat_" + Date.now(),
      name: document.getElementById("cat-name").value,
      color: document.getElementById("cat-color").value
    }
  };

  try {
    const res = await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (result.status === "success") {
      closeCategoryModal();
      fetchCategories();
    } else {
      showErrorNotification("Error", result.message || "เกิดข้อผิดพลาดในการบันทึกหมวดหมู่");
    }
  } catch (err) {
    showErrorNotification("Connection Error", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerText = "Save Category";
  }
}

function handleDeleteCategory(id) {
  pendingDeleteCatId = id;
  const btn = document.getElementById("confirm-delete-cat-btn");
  btn.onclick = executeDeleteCategory;
  document.getElementById("delete-cat-modal").classList.remove("hidden");
}

function closeDeleteCatModal() {
  pendingDeleteCatId = null;
  document.getElementById("delete-cat-modal").classList.add("hidden");
}

async function executeDeleteCategory() {
  if (!pendingDeleteCatId) return;

  const btn = document.getElementById("confirm-delete-cat-btn");
  btn.disabled = true;
  btn.innerText = "Deleting...";

  try {
    const res = await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "deleteCategory",
        id: pendingDeleteCatId
      })
    });

    const result = await res.json();
    closeDeleteCatModal();

    if (result.status === "success") {
      fetchCategories();
      if (currentCategory === pendingDeleteCatId) {
        filterByCategory('all');
      }
    } else {
      showErrorNotification("Error", result.message || "เกิดข้อผิดพลาดในการลบหมวดหมู่");
    }
  } catch (err) {
    closeDeleteCatModal();
    showErrorNotification("Connection Error", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  } finally {
    btn.disabled = false;
    btn.innerText = "Delete";
  }
}

// --- BOOKMARK MODAL HANDLERS ---
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

async function handleAddBookmark(e) {
  e.preventDefault();
  const saveBtn = document.getElementById("save-bm-btn");
  saveBtn.disabled = true;
  saveBtn.innerText = "Saving...";

  const payload = {
    action: "addBookmark",
    data: {
      id: "bm_" + Date.now(),
      category_id: document.getElementById("bm-category").value,
      type: document.getElementById("bm-type").value,
      title: document.getElementById("bm-title").value,
      url: document.getElementById("bm-url").value,
      content: document.getElementById("bm-content").value,
      image_url: uploadedImageBase64
    }
  };

  try {
    const res = await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    
    if (result.status === "success") {
      closeAddModal();
      fetchBookmarkData();
    } else {
      showErrorNotification("Error", result.message || "เกิดข้อผิดพลาดในการบันทึก");
    }
  } catch (err) {
    showErrorNotification("Connection Error", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  } finally {
    saveBtn.disabled = false;
    saveBtn.innerText = "Save Bookmark";
  }
}

function openEditModal(item) {
  document.getElementById("edit-bm-id").value = item.id;
  document.getElementById("edit-bm-type").value = item.type || "link";
  document.getElementById("edit-bm-title").value = item.title || "";
  document.getElementById("edit-bm-url").value = item.url || "";
  document.getElementById("edit-bm-content").value = item.content || "";

  const catSelect = document.getElementById("edit-bm-category");
  catSelect.innerHTML = "";
  cachedCategories.forEach(cat => {
    const selected = cat.id === item.category_id ? "selected" : "";
    catSelect.innerHTML += `<option value="${cat.id}" ${selected}>${cat.name}</option>`;
  });

  const previewImg = document.getElementById("edit-image-preview");
  const container = document.getElementById("edit-image-preview-container");
  
  if (item.image_url) {
    editUploadedImageBase64 = item.image_url;
    previewImg.src = item.image_url;
    container.classList.remove("hidden");
  } else {
    editUploadedImageBase64 = "";
    previewImg.src = "";
    container.classList.add("hidden");
  }

  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeEditModal() {
  document.getElementById("edit-modal").classList.add("hidden");
  document.getElementById("edit-bookmark-form").reset();
  document.getElementById("edit-image-preview-container").classList.add("hidden");
  editUploadedImageBase64 = "";
}

async function handleUpdateBookmark(e) {
  e.preventDefault();
  const btn = document.getElementById("update-bm-btn");
  btn.disabled = true;
  btn.innerText = "Updating...";

  const id = document.getElementById("edit-bm-id").value;
  const payload = {
    action: "updateBookmark",
    id: id,
    data: {
      category_id: document.getElementById("edit-bm-category").value,
      type: document.getElementById("edit-bm-type").value,
      title: document.getElementById("edit-bm-title").value,
      url: document.getElementById("edit-bm-url").value,
      content: document.getElementById("edit-bm-content").value,
      image_url: editUploadedImageBase64
    }
  };

  try {
    const res = await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    
    if (result.status === "success") {
      closeEditModal();
      fetchBookmarkData();
    } else {
      showErrorNotification("Error", result.message || "เกิดข้อผิดพลาดในการอัปเดต");
    }
  } catch (err) {
    showErrorNotification("Connection Error", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  } finally {
    btn.disabled = false;
    btn.innerText = "Update Bookmark";
  }
}

function handleDeleteBookmark(id) {
  pendingDeleteId = id;
  const deleteBtn = document.getElementById("confirm-delete-btn");
  deleteBtn.onclick = executeDelete;
  document.getElementById("delete-modal").classList.remove("hidden");
}

function closeDeleteModal() {
  pendingDeleteId = null;
  document.getElementById("delete-modal").classList.add("hidden");
}

async function executeDelete() {
  if (!pendingDeleteId) return;

  const btn = document.getElementById("confirm-delete-btn");
  btn.disabled = true;
  btn.innerText = "Deleting...";

  try {
    const res = await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({
        action: "deleteBookmark",
        id: pendingDeleteId
      })
    });
    
    const result = await res.json();
    closeDeleteModal();

    if (result.status === "success") {
      fetchBookmarkData();
    } else {
      showErrorNotification("Error", result.message || "เกิดข้อผิดพลาดในการลบ");
    }
  } catch (err) {
    closeDeleteModal();
    showErrorNotification("Connection Error", "ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
  } finally {
    btn.disabled = false;
    btn.innerText = "Delete";
  }
}