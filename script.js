let isUserAdmin = false;

function initializeUserInterface() {
  const session = JSON.parse(localStorage.getItem("thosbook_user") || "null");
  
  if (session) {
    const nameEl = document.getElementById("user-display-name");
    const roleEl = document.getElementById("user-display-role");
    const avatarEl = document.getElementById("user-avatar");

    const displayName = session.name || session.username || "User";
    
    isUserAdmin = (session.role && session.role.toString().toLowerCase() === "admin") || 
                  (session.username && session.username.toString().toLowerCase() === "admin");
    
    const role = isUserAdmin ? "admin" : (session.role || "viewer");

    if (nameEl) nameEl.innerText = displayName;
    if (roleEl) roleEl.innerText = role;
    if (avatarEl) avatarEl.innerText = displayName.charAt(0).toUpperCase();

    if (isUserAdmin) {
      const adminContainer = document.getElementById("admin-link-container");
      if (adminContainer) {
        adminContainer.classList.remove("hidden");
        lucide.createIcons();
      }
    }
  }
}

const originalFetchCategories = window.fetchCategories;
window.fetchCategories = async function() {
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
        
        const adminCategoryActions = isUserAdmin ? `
          <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity pr-1 shrink-0">
            <button onclick='event.stopPropagation(); openEditCategoryModalSidebar(${catJson})' class="p-1 text-gray-400 hover:text-brand-navy rounded hover:bg-gray-200 transition-colors" title="Edit Category">
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
            <button onclick="event.stopPropagation(); deleteCategorySidebar('${cat.id}')" class="p-1 text-gray-400 hover:text-red-500 rounded hover:bg-gray-200 transition-colors" title="Delete Category">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        ` : '';

        categoriesHtml += `
          <div class="group flex items-center justify-between rounded-xl hover:bg-gray-50">
            <button onclick="filterByCategory('${cat.id}', this)" 
               class="category-btn nav-item flex-1 flex items-center gap-3 text-brand-darkNavy px-4 py-2.5 font-medium text-sm transition-colors text-left min-w-0">
              <i data-lucide="folder" class="w-5 h-5 shrink-0" style="color: ${cat.color || 'inherit'}"></i>
              <span class="nav-text truncate">${cat.name}</span>
            </button>
            ${adminCategoryActions}
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
};

function openEditCategoryModalSidebar(cat) {
  document.getElementById("cat-id").value = cat.id;
  document.getElementById("cat-name").value = cat.name;
  document.getElementById("cat-color").value = cat.color || "#0c3d88";
  document.getElementById("cat-modal-title").innerText = "Edit Category";
  document.getElementById("category-modal").classList.remove("hidden");
}

async function deleteCategorySidebar(id) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?")) return;
  try {
    await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "deleteCategory", id: id })
    });
    fetchCategories();
  } catch (err) {
    showErrorNotification("Error", "ไม่สามารถลบหมวดหมู่ได้");
  }
}

function openEditBmModal(bm) {
  document.getElementById("edit-bm-id").value = bm.id;
  document.getElementById("edit-bm-type").value = bm.type || "link";
  document.getElementById("edit-bm-title").value = bm.title || "";
  document.getElementById("edit-bm-url").value = bm.url || "";
  document.getElementById("edit-bm-content").value = bm.content || "";

  const select = document.getElementById("edit-bm-category");
  select.innerHTML = "";
  if (Array.isArray(cachedCategories)) {
    cachedCategories.forEach(c => {
      select.innerHTML += `<option value="${c.id}" ${c.id === bm.category_id ? 'selected' : ''}>${c.name}</option>`;
    });
  }

  document.getElementById("edit-bm-modal").classList.remove("hidden");
}

function closeEditBmModal() {
  document.getElementById("edit-bm-modal").classList.add("hidden");
}

async function handleUpdateBookmark(e) {
  e.preventDefault();
  const id = document.getElementById("edit-bm-id").value;
  const payload = {
    action: "updateBookmark",
    id: id,
    data: {
      category_id: document.getElementById("edit-bm-category").value,
      type: document.getElementById("edit-bm-type").value,
      title: document.getElementById("edit-bm-title").value,
      url: document.getElementById("edit-bm-url").value,
      content: document.getElementById("edit-bm-content").value
    }
  };

  try {
    await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    closeEditBmModal();
    fetchBookmarkData();
  } catch (err) {
    showErrorNotification("Error", "ไม่สามารถอัปเดตข้อมูลได้");
  }
}

async function deleteBookmarkAdmin(id) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบ Bookmark รายการนี้?")) return;
  try {
    await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "deleteBookmark", id: id })
    });
    fetchBookmarkData();
  } catch (err) {
    showErrorNotification("Error", "ไม่สามารถลบข้อมูลได้");
  }
}

window.renderBookmarks = function(data) {
  const container = document.getElementById('cards-container');
  if (!container) return;

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-500">ไม่พบข้อมูล Bookmark</div>`;
    return;
  }

  container.innerHTML = "";
  data.forEach((item) => {
    let typeLabel = item.type === "text" ? "Text / Note" : (item.type === "video" ? "Video" : "Link");
    const bmJson = JSON.stringify(item).replace(/'/g, "&apos;").replace(/"/g, "&quot;");

    const imageHtml = item.image_url ? `
      <div class="relative group/img mb-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
        <img 
          src="${item.image_url}" 
          alt="${item.title}" 
          onclick="openImageLightbox('${item.image_url}', '${item.title || 'Image Preview'}')" 
          class="w-full h-40 object-cover cursor-pointer transition-transform duration-300 group-hover/img:scale-105" 
        />
      </div>
    ` : '';

    const adminActionsHtml = isUserAdmin ? `
      <div class="flex items-center gap-1">
        <button onclick='openEditBmModal(${bmJson})' class="p-1.5 text-gray-400 hover:text-brand-navy rounded-lg hover:bg-gray-100 transition-colors" title="Edit Bookmark">
          <i data-lucide="pencil" class="w-4 h-4"></i>
        </button>
        <button onclick="deleteBookmarkAdmin('${item.id}')" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors" title="Delete Bookmark">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
    ` : '';

    const cardHtml = `
      <div class="bg-white rounded-2xl p-6 shadow-sm min-h-[180px] flex flex-col justify-between hover:shadow-md transition-shadow relative group">
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-accentOrange text-brand-darkNavy inline-block">
              ${typeLabel}
            </span>
            ${adminActionsHtml}
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
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeUserInterface);
} else {
  initializeUserInterface();
}