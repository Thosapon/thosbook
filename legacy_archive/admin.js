let adminUsers = [];

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
  fetchAdminUsers();
});

// --- FETCH USERS FROM GAS ---
async function fetchAdminUsers() {
  const container = document.getElementById("admin-user-cards");
  if (!container) return;

  try {
    const res = await fetch(`${GAS_API_URL}?action=getUsers`);
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      adminUsers = data;
      renderUserCards(adminUsers);
    } else {
      // Fallback ดึงข้อมูลจาก LocalStorage เพื่อนำเสนอบัญชีปัจจุบัน
      const localSession = JSON.parse(localStorage.getItem("thosbook_user") || "null");
      if (localSession) {
        renderUserCards([localSession]);
      } else {
        container.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 text-sm">ไม่พบข้อมูลผู้ใช้งาน</div>`;
      }
    }
  } catch (err) {
    console.error("Error fetching users:", err);
    container.innerHTML = `<div class="col-span-full text-center py-12 text-red-500 text-sm">เกิดข้อผิดพลาดในการโหลดข้อมูลผู้ใช้</div>`;
  }
}

function renderUserCards(users) {
  const container = document.getElementById("admin-user-cards");
  if (!container) return;

  container.innerHTML = "";
  users.forEach(u => {
    const userJson = JSON.stringify(u).replace(/'/g, "&apos;").replace(/"/g, "&quot;");
    const isAdmin = String(u.role).toLowerCase() === "admin";
    const badgeBg = isAdmin ? "bg-red-50 text-red-600 border-red-100" : "bg-blue-50 text-brand-navy border-blue-100";

    container.innerHTML += `
      <div class="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="w-10 h-10 rounded-full bg-brand-navy text-white font-bold flex items-center justify-center text-sm shadow-sm">
              ${(u.name || u.username || 'U').charAt(0).toUpperCase()}
            </div>
            <span class="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${badgeBg}">
              ${u.role || 'viewer'}
            </span>
          </div>
          <div>
            <h3 class="font-bold text-sm text-brand-darkNavy truncate">${u.name || u.username}</h3>
            <p class="text-xs text-gray-400 truncate">@${u.username}</p>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-gray-100 flex justify-end gap-1">
          <button onclick='openEditUserModal(${userJson})' class="p-1.5 text-gray-400 hover:text-brand-navy rounded-lg hover:bg-gray-100 transition-colors" title="Edit User">
            <i data-lucide="pencil" class="w-4 h-4"></i>
          </button>
          <button onclick="deleteUser('${u.id}')" class="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 transition-colors" title="Delete User">
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      </div>
    `;
  });
  lucide.createIcons();
}

// --- USER MODAL ACTIONS ---
function openAddUserModal() {
  document.getElementById("user-id").value = "";
  document.getElementById("user-fullname").value = "";
  document.getElementById("user-username").value = "";
  document.getElementById("user-password").value = "";
  document.getElementById("user-role").value = "viewer";
  document.getElementById("user-modal-title").innerText = "New User";
  document.getElementById("user-modal").classList.remove("hidden");
}

function openEditUserModal(user) {
  document.getElementById("user-id").value = user.id || "";
  document.getElementById("user-fullname").value = user.name || "";
  document.getElementById("user-username").value = user.username || "";
  document.getElementById("user-password").value = user.password || "";
  document.getElementById("user-role").value = (user.role || "viewer").toLowerCase();
  document.getElementById("user-modal-title").innerText = "Edit User";
  document.getElementById("user-modal").classList.remove("hidden");
}

function closeUserModal() {
  document.getElementById("user-modal").classList.add("hidden");
  document.getElementById("user-form").reset();
}

async function handleSaveUser(e) {
  e.preventDefault();
  const saveBtn = document.getElementById("save-user-btn");
  saveBtn.disabled = true;

  const userId = document.getElementById("user-id").value;
  const isEdit = Boolean(userId);

  const payload = {
    action: isEdit ? "updateUser" : "addUser",
    id: isEdit ? userId : undefined,
    data: {
      id: isEdit ? userId : "usr_" + Date.now(),
      name: document.getElementById("user-fullname").value,
      username: document.getElementById("user-username").value,
      password: document.getElementById("user-password").value,
      role: document.getElementById("user-role").value
    }
  };

  try {
    await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    closeUserModal();
    fetchAdminUsers();
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการบันทึกข้อมูลผู้ใช้");
  } finally {
    saveBtn.disabled = false;
  }
}

async function deleteUser(id) {
  if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้นี้?")) return;
  try {
    await fetch(GAS_API_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "deleteUser", id: id })
    });
    fetchAdminUsers();
  } catch (err) {
    alert("เกิดข้อผิดพลาดในการลบผู้ใช้");
  }
}

// --- SIDEBAR TOGGLE & INITIALIZE USER PROFILE ---
let isCollapsed = false;

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const navTexts = document.querySelectorAll('.nav-text');
  
  isCollapsed = !isCollapsed;

  if (isCollapsed) {
    sidebar.classList.remove('w-64', 'p-4');
    sidebar.classList.add('w-16', 'p-2');
    navTexts.forEach(el => el.classList.add('hidden'));
  } else {
    sidebar.classList.remove('w-16', 'p-2');
    sidebar.classList.add('w-64', 'p-4');
    navTexts.forEach(el => el.classList.remove('hidden'));
  }
}

function initializeAdminProfile() {
  const userSession = JSON.parse(localStorage.getItem("thosbook_user") || "null");
  if (userSession) {
    const nameEl = document.getElementById("user-display-name");
    const roleEl = document.getElementById("user-display-role");
    const avatarEl = document.getElementById("user-avatar");

    const displayName = userSession.name || userSession.username || "Admin";
    const role = userSession.role || "admin";

    if (nameEl) nameEl.innerText = displayName;
    if (roleEl) roleEl.innerText = role;
    if (avatarEl) avatarEl.innerText = displayName.charAt(0).toUpperCase();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeAdminProfile);
} else {
  initializeAdminProfile();
}