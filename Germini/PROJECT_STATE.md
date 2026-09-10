# **สรุปสถานะโปรเจกต์ (PROJECT_STATE.md)**

## **1. Tech Stack & Architecture**

โปรเจกต์ **Thosbook** สิ้นสุดการเปลี่ยนผ่านสถาปัตยกรรมจาก Jamstack (Vanilla JS) เข้าสู่ **Single-Page React Application (SPA)** เต็มรูปแบบเรียบร้อยแล้ว โดยเชื่อมต่อระหว่าง Frontend UI และ Google Workspace Services มีรายละเอียด Tech Stack ดังนี้:

> * **Frontend Architecture:** React 18 (Functional Components & React Hooks), ES6+ JavaScript  
> * **Styling & UI Design:** Tailwind CSS (ผ่าน Utility Classes / PostCSS) ร่วมกับ Custom Stylesheet (`css/theme.css`) และ Design System จาก Figma  
> * **State Management:** React Context API (`ThosbookContext.jsx` เป็น Single Source of Truth สำหรับจัดการ Global State และ CRUD Operations ทั้งหมด)  
> * **Navigation & Routing:** React SPA View Switcher (`AppRouter.jsx`) รองรับการสลับหน้าไร้การ Reload ร่วมกับ `MobileBottomNav.jsx`  
> * **Performance & Caching:** รองรับ Code Splitting ด้วย `React.lazy + Suspense` และเพิ่มระบบ In-Memory Caching (พร้อม 5-min TTL & Invalidation) ใน Context API  
> * **Production Reliability & Resilience:** ครอบแอปพลิเคชันด้วย `ErrorBoundary.jsx` สำหรับดักจับ Runtime Errors และ `OfflineBanner.jsx` สำหรับแจ้งเตือนสถานะการเชื่อมต่ออินเทอร์เน็ต  
> * **Build Tooling & Deployment:** ใช้ **Vite 5** เป็น Bundler ร่วมกับ PostCSS/Autoprefixer พร้อมตั้งค่า `vercel.json` สำหรับ SPA Client-Side Rewrites และ Vercel Environment Variables (`VITE_API_BASE_URL`)  
> * **Database & Backend Infrastructure:**  
  * **Database (DB):** Google Sheets (ใช้สำหรับจัดเก็บข้อมูลยืม-คืน, สมาชิก, รายการหนังสือ และการแจ้งเตือน)  
  * **Backend API / Cloud-based App:** Google Apps Script (GAS) ทำหน้าที่เป็น RESTful Web App / API Gateway สำหรับรับส่งข้อมูลกับ Google Sheets  
> * **Hosting & Version Control:**  
  * **Host:** Vercel (สำหรับการ Deploy Web Application)  
  * **Source Control:** GitHub (https://github.com/Thosapon/thosbook)  
> * **Architecture Pattern:**  
  * **Modular Component Architecture:** แยก Components ตามหลัก Single Responsibility Principle, Centralized API ใน `js/core/api.js` และ Auth Layer ใน `js/core/auth.js`  
  * **State & Storage Management:** React Context API (`ThosbookContext.jsx`) ร่วมกับ localStorage และการเรียก API ผ่าน Google Apps Script  
  * **Responsive & Multi-View Interface:** รองรับการแสดงผลทั้ง Desktop และ Mobile Views ด้วย Tailwind CSS Responsive Utilities

---

## **2. Current Features (ฟีเจอร์ที่ทำเสร็จแล้วและทำงานได้จริง)**

| หมวดหมู่ | รายการฟีเจอร์ | สถานะ / รายละเอียด |
| :--- | :--- | :--- |
| **Database & Cloud Backend Integration** | Google Sheets & Apps Script Sync | เชื่อมต่อ Database Google Sheets ผ่าน Google Apps Script สำหรับ CRUD ข้อมูลยืม-คืนและสมาชิก |
| **API & Error Handling Layer** | Centralized API with Timeout & Fallback (`js/core/api.js`) | พัฒนา `fetchApi` รองรับ `try...catch`, Timeout Controller (`AbortController`), และส่งคืน Standard Error State `{ success, data, error }` ป้องกัน UI ค้างเมื่อ API ไม่ตอบสนอง |
| **Data Architecture & Refactoring** | Centralized Data Services (`ThosbookAPI`) | Refactor API Calls ย้าย Data Mapping/Transformation เช่น `getNormalizedDashboardData()` และ `getFormattedCategories()` มาไว้ที่ `ThosbookAPI` |
| **React Architecture Migration** | React Context API & Functional Components | โครงสร้าง React Functional Components + Hooks และ `ThosbookContext.jsx` สำหรับควบคุม Global State ตามข้อตกลง `CONVENTIONS.md` |
| **Unified Data Fetching & CRUD State** | Centralized CRUD Operations (`ThosbookContext.jsx`) | รวมการดึงข้อมูลและจัดการ CRUD Operations (Add/Update/Delete) ทั้งหมดสำหรับ Bookmarks และ Categories ไว้ใน Context API เดียวกัน |
| **Performance Optimization & Caching** | Code Splitting & In-Memory TTL Cache | เพิ่ม `React.lazy + Suspense` ลด Initial Bundle Size และเพิ่ม In-Memory Caching (5-min TTL + Cache Invalidation) ใน `ThosbookContext.jsx` ลดการดึงข้อมูลซ้ำซ้อนผ่าน GAS API |
| **Production Reliability & Deployment** | Vercel Deployment & Vite Config | กำหนดค่า `vite.config.js`, `postcss.config.js`, `tailwind.config.js` (ESM) และ `vercel.json` ปรับใช้ `VITE_API_BASE_URL` รองรับ Production Build สมบูรณ์ |
| **Modular UI Components** | Reusable Functional Components (`src/components/`) | แยก UI ชิ้นส่วนซ้ำๆ ออกเป็น React Functional Components เช่น `BookCard.jsx`, `BorrowReturnModal.jsx`, `NotificationBadge.jsx`, `MobileBottomNav.jsx`, `ErrorBoundary.jsx` และ `OfflineBanner.jsx` |
| **Assembled Views & Layouts** | Main Dashboard Views (`src/views/`) | ประกอบ UI Components เข้าด้วยกันใน Views หลัก ได้แก่ `DashboardView.jsx` (Desktop), `MobileDashboardView.jsx` (Mobile), `CategoriesView.jsx`, `NotificationsView.jsx` และ `SettingsView.jsx` |
| **Routing & View Switching** | Client-Side SPA Router (`src/router/AppRouter.jsx`) | ระบบ View Switcher จัดการการเปลี่ยนหน้าระหว่าง Dashboard, Categories, Notifications และ Settings แบบ SPA เต็มรูปแบบ |
| **Production Reliability & Fallback** | Error Boundary & Offline Indicator | เพิ่ม `ErrorBoundary.jsx` ครอบ `AppRouter.jsx` เพื่อป้องกันแอปพลิเคชัน Crash หน้าขาว พร้อม `OfflineBanner.jsx` ตรวจจับและแจ้งเตือนเมื่อขาดอินเทอร์เน็ต |
| **Environment & GAS Integration** | Live Google Sheets Sync & Real Borrow-Return | เชื่อมต่อฟังก์ชันยืม-คืนหนังสือใน `BorrowReturnModal.jsx` และ `ThosbookAPI` เข้ากับ Google Sheets จริง |
| **Authentication & Authorization** | ระบบเข้าสู่ระบบ / ออกจากระบบ (Login / Logout) | ตรวจสอบสิทธิ์ผ่าน `login.html` และควบคุม Session ด้วย `js/core/auth.js` |
| **Legacy Sunset & Cleanup** | Modernized `index.html` & Archive Strategy | ทำการ Sunset และ Cleanup ไฟล์ HTML/JS เดิมฝั่ง Vanilla JS เข้าสู่ `legacy_archive/` และลบไฟล์ซ้ำซ้อนใน `src/components/AppRouter.js` |

---

## **3. Known Issues & Bugs (ปัญหาและ Error ที่พบในปัจจุบัน)**

> 1. **ข้อจำกัดของการดึงไฟล์เก็บบีบอัด (Archive Extraction Error):**  
   * **อาการ:** เกิดข้อผิดพลาดเมื่อพยายามแตกไฟล์บีบอัดประเภท RAR/Archive ในสภาพแวดล้อมระบบเนื่องจากขาดคำสั่ง unrar/7z  
   * **แนวทางแก้ไข:** ใช้การ Sync โดยตรงผ่าน GitHub Repository (https://github.com/Thosapon/thosbook) หรือใช้ไฟล์บีบอัดมาตรฐาน .zip  

---

## **4. File Structure (โครงสร้างโฟลเดอร์และหน้าที่ของแต่ละไฟล์)**

Thosbook/  
├── index.html                   # หน้าแรก Entry Point สำหรับ React App Router (SPA)  
├── login.html                   # หน้าเข้าสู่ระบบ (Authentication)  
├── package.json                 # ไฟล์จัดการ Dependencies และ Build Scripts (Vite)  
├── vite.config.js               # ไฟล์ตั้งค่า Vite Bundler & Manual Chunk Splitting  
├── vercel.json                  # ไฟล์ตั้งค่า Vercel Deployment & SPA Client-Side Rewrites  
├── postcss.config.js            # ไฟล์ตั้งค่า PostCSS สำหรับ Tailwind CSS & Autoprefixer  
├── tailwind.config.js           # ไฟล์ตั้งค่า Tailwind CSS (ES Module Export)  
│  
├── css/  
│   └── theme.css                # ไฟล์สไตล์ CSS หลัก Custom Theme & Override  
│  
├── src/                         # โครงสร้างหลัก React Components & State  
│   ├── context/  
│   │   └── ThosbookContext.jsx  # Context API Provider จัดการ Global State, CRUD Operations & In-Memory TTL Cache  
│   ├── components/  
│   │   ├── BookCard.jsx         # React Functional Component แสดง Card รายการหนังสือ/บุ๊กมาร์ก  
│   │   ├── BorrowReturnModal.jsx # React Functional Component สำหรับ Modal บันทึกการยืม-คืน  
│   │   ├── NotificationBadge.jsx # React Functional Component แสดง Badge แจ้งเตือน  
│   │   ├── MobileBottomNav.jsx  # แถบ Navigation ด้านล่างสำหรับมุมมองมือถือ  
│   │   ├── ErrorBoundary.jsx    # Component สำหรับดักจับ Unexpected React Runtime Errors  
│   │   └── OfflineBanner.jsx    # Indicator แจ้งเตือนเมื่อขาดการเชื่อมต่ออินเทอร์เน็ต  
│   ├── router/  
│   │   └── AppRouter.jsx        # Single-Page Router / View Switcher รองรับ Code Splitting (lazy + Suspense)  
│   └── views/  
│       ├── DashboardView.jsx       # Layout หลักสำหรับ Desktop View  
│       ├── MobileDashboardView.jsx # Layout หลักสำหรับ Mobile View  
│       ├── CategoriesView.jsx      # View หน้าจัดการหมวดหมู่ (Lazy Loaded)  
│       ├── NotificationsView.jsx   # View หน้าศูนย์การแจ้งเตือน (Lazy Loaded)  
│       └── SettingsView.jsx        # View หน้าการตั้งค่า (Lazy Loaded)  
│  
├── js/  
│   └── core/  
│       ├── config.js            # ไฟล์กำหนดค่าส่วนกลาง (ดึง VITE_API_BASE_URL, Constants)  
│       ├── api.js               # Centralized Service Layer พร้อม Error Handling, Timeout, Borrow/Return Services  
│       └── auth.js              # ระบบจัดการ Authentication, Session & LocalStorage  
│  
└── legacy_archive/              # โฟลเดอร์เก็บไฟล์ Legacy เดิมฝั่ง Vanilla JS ที่ทำการ Sunset เรียบร้อยแล้ว  
    ├── dashboard.html           # (Archived) ย้ายไป src/views/DashboardView.jsx  
    ├── admin-manage.html        # (Archived)  
    ├── app.js                   # (Archived) Logic ดึงข้อมูลย้ายไป ThosbookAPI และ Context API  
    ├── admin.js                 # (Archived)  
    ├── script.js                # (Archived) Helpers ย้ายไป React Components  
    ├── js/components/mobile-app.js # (Archived)  
    └── m_*.html                 # (Archived) หน้า Mobile Views ทั้งหมดถูกย้ายไป React Views และ AppRouter.jsx  

---

## **5. Legacy Sunset Strategy & Migration Status**

| Legacy File / Component | สถานะการ Migration | Target React Component / Service |
| :--- | :--- | :--- |
| `m_dashboard.html` | ✅ Archived | `src/views/MobileDashboardView.jsx` |
| `m_category*.html` | ✅ Archived | `src/views/CategoriesView.jsx` |
| `m_notification*.html` | ✅ Archived | `src/views/NotificationsView.jsx` |
| `m_settings*.html` | ✅ Archived | `src/views/SettingsView.jsx` |
| `dashboard.html` | ✅ Archived | `src/views/DashboardView.jsx` |
| `app.js` / `mobile-app.js` | ✅ Archived | `src/context/ThosbookContext.jsx` & `js/core/api.js` |
| `script.js` | ✅ Archived | Reusable Utility Hooks & Utility functions ใน React |
| `src/components/AppRouter.js` | 🗑️ Deleted | ย้ายและคลีนไปที่ `src/router/AppRouter.jsx` |
