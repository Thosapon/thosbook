let adminCategories = [];
let adminBookmarks = [];

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  loadAdminData();
});

async function loadAdminData() {
  await fetchAdminCategories();
  await fetchAdminBookmarks();
}

// 2. เรนเดอร์ Category Cards พร้อมปุ่ม แก้ไข และ ลบ
async function fetchAdminCategories() {
  const container = document.getElementById("admin-category-cards");
  try {
    const res = await fetch(`${GAS_API_URL}?action=getCategories`);
    adminCategories = await res.json();
    
    if (!Array.isArray(adminCategories) || adminCategories.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-8 text-gray-400">ไม่พบหมวดหมู่</div>`;
      return;
    }

    container.innerHTML = "";
    adminCategories.forEach(cat => {
      const catJson = JSON.stringify(cat).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
      container.innerHTML += `
        <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style="background-color: ${cat.color || '#0c3d88'}20">
              <i data-lucide="folder" class="w-4 h-4" style="color: ${cat.color || '#0c3d88'}"></i>
            </div>
            <span class="font-bold text-sm text-brand-darkNavy truncate">${cat.name}</span>
          </div>
          <!-- ปุ่ม แก้ไข / ลบ -->
          <div class="flex items-center gap-1 shrink-0">
            <button onclick='openEditCategoryModal(${catJson})' class="p-1.5 text-gray-400 hover:text-brand-navy rounded-lg hover:bg-gray-100 transition-colors" title="Edit Category">
              <i data-lucide="pencil" class="w-4 h-4"></i>
            </button>
            <button onclick="deleteCategory('${cat.id}')" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors" title="Delete Category">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
        </div>
      `;
    });
    lucide.createIcons();
  } catch (err) { console.error(err); }
}

// 2. เรนเดอร์ Bookmark Cards พร้อมปุ่ม แก้ไข และ ลบ
async function fetchAdminBookmarks() {
  const container = document.getElementById("admin-bookmark-cards");
  try {
    const res = await fetch(`${GAS_API_URL}?action=getBookmarks`);
    adminBookmarks = await res.json();

    if (!Array.isArray(adminBookmarks) || adminBookmarks.length === 0) {
      container.innerHTML = `<div class="col-span-full text-center py-8 text-gray-400">ไม่พบ Bookmark</div>`;
      return;
    }

    container.innerHTML = "";
    adminBookmarks.forEach(bm => {
      const bmJson = JSON.stringify(bm).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
      let typeLabel = bm.type === "text" ? "Text / Note" : (bm.type === "video" ? "Video" : "Link");

      const imageHtml = bm.image_url ? `
        <div class="mb-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
          <img src="${bm.image_url}" alt="${bm.title}" class="w-full h-36 object-cover" />
        </div>
      ` : '';

      container.innerHTML += `
        <div class="bg-white rounded-2xl p-6 shadow-sm min-h-[180px] flex flex-col justify-between border border-gray-100 hover:shadow-md transition-shadow relative">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs font-semibold px-2.5 py-1 rounded-md bg-brand-accentOrange text-brand-darkNavy inline-block">
                ${typeLabel}
              </span>
              <!-- ปุ่ม แก้ไข / ลบ -->
              <div class="flex items-center gap-1">
                <button onclick='openEditBookmarkModal(${bmJson})' class="p-1.5 text-gray-400 hover:text-brand-navy rounded-lg hover:bg-gray-100 transition-colors" title="Edit Bookmark">
                  <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteBookmark('${bm.id}')" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors" title="Delete Bookmark">
                  <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
              </div>
            </div>
            ${imageHtml}
            <h3 class="text-base font-semibold text-brand-darkNavy line-clamp-2">${bm.title || 'ไม่มีหัวข้อ'}</h3>
            <p class="text-sm text-gray-600 mt-2 line-clamp-3">${bm.content || ''}</p>
          </div>
          <div class="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-sm font-medium text-brand-darkNavy">
            <span>${bm.url ? new URL(bm.url).hostname : ''}</span>
            ${bm.url ? `<a href="${bm.url}" target="_blank" class="text-brand-navy hover:underline">เปิดลิงก์ ↗</a>` : ''}
          </div>
        </div>
      `;
    });
    lucide.createIcons();
  } catch (err) { console.error(err); }
}

function openEditCategoryModal(cat) {
  document.getElementById("cat-id").value = cat.id;
  document.getElementById("cat-name").value = cat.name;
  document.getElementById("cat-color").value = cat.color || "#0c3d88";
  document.getElementById("category-modal").classList.remove("hidden");
}

function closeCategoryModal() { document.getElementById("category-modal").classList.add("hidden"); }

async function handleSaveCategory(e) {
  e.preventDefault();
  const catId = document.getElementById("cat-id").value;
  const payload = {
    action: "updateCategory",
    id: catId,
    data: { id: catId, name: document.getElementById("cat-name").value, color: document.getElementById("cat-color").value }
  };
  await fetch(GAS_API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  closeCategoryModal();
  fetchAdminCategories();
}

async function deleteCategory(id) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?")) return;
  await fetch(GAS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "deleteCategory", id: id })
  });
  fetchAdminCategories();
}

function openEditBookmarkModal(bm) {
  document.getElementById("edit-bm-id").value = bm.id;
  document.getElementById("edit-bm-type").value = bm.type || "link";
  document.getElementById("edit-bm-title").value = bm.title || "";
  document.getElementById("edit-bm-url").value = bm.url || "";
  document.getElementById("edit-bm-content").value = bm.content || "";

  const select = document.getElementById("edit-bm-category");
  select.innerHTML = "";
  adminCategories.forEach(c => {
    select.innerHTML += `<option value="${c.id}" ${c.id === bm.category_id ? 'selected' : ''}>${c.name}</option>`;
  });

  document.getElementById("edit-modal").classList.remove("hidden");
}

function closeEditModal() { document.getElementById("edit-modal").classList.add("hidden"); }

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
  await fetch(GAS_API_URL, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(payload) });
  closeEditModal();
  fetchAdminBookmarks();
}

async function deleteBookmark(id) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบ Bookmark รายการนี้?")) return;
  await fetch(GAS_API_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "deleteBookmark", id: id })
  });
  fetchAdminBookmarks();
}