import React, { useState, useEffect } from 'react';

// วาง Web App URL ที่ได้จากขั้นตอน Deploy Google Apps Script
const GAS_API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

export default function BookmarkApp() {
  const [categories, setCategories] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 1. Fetch Data จาก Google Sheet ผ่าน GAS
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${GAS_API_URL}?action=getAllData`);
      const data = await res.json();
      setCategories(data.categories || []);
      setBookmarks(data.bookmarks || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Filter Logic ตาม Category และ Search Query
  const filteredBookmarks = bookmarks.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category_id === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-surface-page font-prompt text-text-body">
      {/* Top Navigation */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border-default bg-white px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-blue-400 font-montserrat font-bold text-white">
            B
          </div>
          <h1 className="font-montserrat text-xl font-bold text-brand-blue-1000">
            Bookmark Hub
          </h1>
        </div>

        {/* Global Search Bar */}
        <div className="w-1/3">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาข้อความ, ลิงก์ หรือวิดีโอ..."
            className="w-full rounded-md border border-border-default bg-brand-grey-50 px-4 py-2 text-sm text-text-body placeholder-text-placeholder focus:border-brand-blue-400 focus:outline-none"
          />
        </div>

        <button className="rounded-md bg-surface-primary px-4 py-2 font-montserrat text-sm font-medium text-white transition-colors hover:bg-surface-hover">
          + เพิ่ม Bookmark
        </button>
      </header>

      {/* Main Body */}
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar - Categories */}
        <aside className="w-64 border-r border-border-default bg-white p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-montserrat text-xs font-semibold uppercase tracking-wider text-text-muted">
              Categories
            </span>
            <button className="text-xs font-medium text-brand-blue-400 hover:underline">
              + สร้างใหม่
            </button>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-surface-highlight text-brand-blue-400'
                  : 'text-brand-grey-800 hover:bg-brand-grey-100'
              }`}
            >
              ทั้งหมด (All)
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-surface-highlight text-brand-blue-400'
                    : 'text-brand-grey-800 hover:bg-brand-grey-100'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color || '#0c3d88' }}
                  />
                  {cat.name}
                </span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text-heading">
              {selectedCategory === 'all' ? 'รายการทั้งหมด' : 'รายการในหมวดหมู่'}
            </h2>
            <span className="text-sm text-text-muted">
              {filteredBookmarks.length} รายการ
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-text-muted">กำลังโหลดข้อมูล...</div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredBookmarks.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col justify-between overflow-hidden rounded-lg border border-border-default bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-brand-blue-50 text-brand-blue-200">
                      No Preview
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-4">
                    <span className="mb-2 inline-block w-max rounded bg-surface-highlight px-2 py-0.5 text-xs font-semibold text-brand-blue-400">
                      {item.type}
                    </span>
                    <h3 className="mb-1 line-clamp-1 font-bold text-text-heading">
                      {item.title}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-xs text-text-muted">
                      {item.content}
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-brand-grey-100 pt-3 text-xs text-text-placeholder">
                      <span>{new Date(item.created_at).toLocaleDateString('th-TH')}</span>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-brand-blue-400 hover:underline"
                        >
                          เปิดลิงก์ ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// เพิ่มการเช็ก Action 'login' ใน doPost(e)
function doPost(e) {
  try {
    const contents = JSON.parse(e.postData.contents);
    const action = contents.action;
    
    if (action === 'login') {
      return responseJSON(checkLogin(contents.username, contents.password));
    }
    // ... โค้ดเดิม (addCategory, addBookmark, deleteBookmark) ...
    
  } catch (error) {
    return responseJSON({ status: 'error', message: error.toString() });
  }
}

// ฟังก์ชันตรวจสอบ User
function checkLogin(username, password) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Users');
  if (!sheet) return { status: 'error', message: 'Tab Users not found' };
  
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    const dbUser = data[i][1]; // Column B: username
    const dbPass = data[i][2]; // Column C: password
    
    if (dbUser == username && dbPass == password) {
      return { 
        status: 'success', 
        message: 'Login successful',
        user: { id: data[i][0], username: dbUser }
      };
    }
  }
  return { status: 'error', message: 'Invalid username or password' };
}