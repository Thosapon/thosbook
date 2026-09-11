# **สรุปสถานะโปรเจกต์ (PROJECT_STATE.md)**

## **1. Tech Stack & Architecture**

โปรเจกต์ **Thosbook** สิ้นสุดการเปลี่ยนผ่านสถาปัตยกรรมจาก Jamstack (Vanilla JS) เข้าสู่ **Single-Page React Application (SPA)** เต็มรูปแบบเรียบร้อยแล้ว โดยเชื่อมต่อระหว่าง Frontend UI และ Google Workspace Services มีรายละเอียด Tech Stack ดังนี้:

> * **Frontend Architecture:** React 18 (Functional Components & React Hooks), ES6+ JavaScript  
> * **Styling & UI Design:** Tailwind CSS (ผ่าน Utility Classes / PostCSS) ร่วมกับ Custom Stylesheet (`css/theme.css`) และ Design System จาก Figma (Semantic Tokens: `surface.*`, `text.*`, `border.*`, `brand.*` ใน `tailwind.config.js`)  
> * **State Management:** React Context API (`ThosbookContext.jsx` เป็น Single Source of Truth สำหรับจัดการ Global State และ CRUD Operations ทั้งหมด)  
> * **Navigation & Routing:** React SPA View Switcher (`AppRouter.jsx`) รองรับการสลับหน้าไร้การ Reload ร่วมกับ `MobileBottomNav.jsx`  
> * **Performance & Caching:** รองรับ Code Splitting ด้วย `React.lazy + Suspense` และเพิ่มระบบ In-Memory Caching (พร้อม 5-min TTL & Invalidation) ใน Context API  
> * **Production Reliability & Resilience:** ครอบแอปพลิเคชันด้วย `ErrorBoundary.jsx` สำหรับดักจับ Runtime Errors และ `OfflineBanner.jsx` สำหรับแจ้งเตือนสถานะการเชื่อมต่ออินเทอร์เน็ต  
> * **Build Tooling & Deployment:** ใช้ **Vite 5** เป็น Bundler ร่วมกับ PostCSS/Autoprefixer พร้อมตั้งค่า `vercel.json` สำหรับ SPA Client-Side Rewrites และ Vercel Environment Variables (`VITE_API_BASE_URL` สำหรับฝั่ง Client, `GAS_API_URL` สำหรับฝั่ง Server เท่านั้น)  
> * **Database & Backend Infrastructure:**  
  * **Database (DB):** Google Sheets (ใช้สำหรับจัดเก็บข้อมูลยืม-คืน, สมาชิก, รายการหนังสือ และการแจ้งเตือน)  
  * **Backend API / Cloud-based App:** Google Apps Script (GAS) ทำหน้าที่เป็น RESTful Web App / API Gateway สำหรับรับส่งข้อมูลกับ Google Sheets  
  * **API Proxy Layer:** Vercel Serverless Function (`api/gas-proxy.js`) ทำหน้าที่เป็น Server-to-Server Proxy ระหว่าง React App กับ GAS Web App เพื่อแก้ปัญหา Third-Party Cookie Blocking ที่เกิดจาก Browser Redirect ข้าม Domain (`script.google.com` → `script.googleusercontent.com`)  
> * **Hosting & Version Control:**  
  * **Host:** Vercel (สำหรับการ Deploy Web Application)  
  * **Source Control:** GitHub (https://github.com/Thosapon/thosbook)  
> * **Architecture Pattern:**  
  * **Modular Component Architecture:** แยก Components ตามหลัก Single Responsibility Principle, Centralized API ใน `js/core/api.js` และ Auth Layer ใน `js/core/auth.js`  
  * **State & Storage Management:** React Context API (`ThosbookContext.jsx`) ร่วมกับ localStorage และการเรียก API ผ่าน Google Apps Script (ผ่าน Server-side Proxy)  
  * **Responsive & Multi-View Interface:** รองรับการแสดงผลทั้ง Desktop และ Mobile Views ด้วย Tailwind CSS Responsive Utilities

---

## **2. Current Features (ฟีเจอร์ที่ทำเสร็จแล้วและทำงานได้จริง)**

| หมวดหมู่ | รายการฟีเจอร์ | สถานะ / รายละเอียด |
| :--- | :--- | :--- |
| **API Reliability & CORS Fix** | Server-Side Proxy สำหรับ GAS API (`api/gas-proxy.js`) | สร้าง Vercel Serverless Function เป็นตัวกลางเรียก Google Apps Script แทนการยิง Fetch ตรงจาก Browser แก้ปัญหา Request ถูก `(canceled)` จาก Third-Party Cookie Blocking ตอน Browser ตาม Redirect ข้าม Domain ของ GAS Web App, ย้าย URL จริงของ GAS ไปเก็บใน Environment Variable ฝั่ง Server (`GAS_API_URL`) แทนการ Expose ผ่าน `VITE_` Prefix |
| **UI Consistency & Design System Alignment** | ปรับ `BookCard.jsx` ให้ใช้ Semantic Design Token | แก้ไข Class จาก Tailwind Default Palette (`text-gray-400/900/500`, `border-gray-100/50`) ให้อ้างอิง Token ที่กำหนดใน `tailwind.config.js` (`text-muted`, `text-heading`, `text-body`, `border-default`, `brand-blue-500`) แก้ปัญหาสี/สไตล์ของ UI ไม่ตรงกับ Figma Design System |
| **Database & Cloud Backend Integration** | Google Sheets & Apps Script Sync | เชื่อมต่อ Database Google Sheets ผ่าน Google Apps Script สำหรับ CRUD ข้อมูลยืม-คืนและสมาชิก |
| **API & Error Handling Layer** | Centralized API with Timeout & Fallback (`js/core/api.js`) | พัฒนา `fetchApi` รองรับ `try...catch`, Timeout Controller (`AbortController`), และส่งคืน Standard Error State `{ success, data, error }` ป้องกัน UI ค้างเมื่อ API ไม่ตอบสนอง |
| **Data Architecture & Refactoring** | Centralized Data Services (`ThosbookAPI`) | Refactor API Calls ย้าย Data Mapping/Transformation เช่น `getNormalizedDashboardData()` และ `getFormattedCategories()` มาไว้ที่ `ThosbookAPI` |
| **React Architecture Migration** | React Context API & Functional Components | โครงสร้าง React Functional Components + Hooks และ `ThosbookContext.jsx` สำหรับควบคุม Global State ตามข้อตกลง `CONVENTIONS.md` |
| **Unified Data Fetching & CRUD State** | Centralized CRUD Operations (`ThosbookContext.jsx`) | รวมการดึงข้อมูลและจัดการ CRUD Operations (Add/Update/Delete) ทั้งหมดสำหรับ Bookmarks และ Categories ไว้ใน Context API เดียวกัน |
| **Performance Optimization & Caching** | Code Splitting & In-Memory TTL Cache | เพิ่ม `React.lazy + Suspense` ลด Initial Bundle Size และเพิ่ม In-Memory Caching (5-min TTL + Cache Invalidation) ใน `ThosbookContext.jsx` ลดการดึงข้อมูลซ้ำซ้อนผ่าน GAS API |
| **Production Reliability & Deployment** | Vercel Deployment & Vite Config Fixes | แก้ไขปัญหา Vercel Deployment Build Error ทั้งหมด: เพิ่ม Named & Default Exports สำหรับ `ThosbookAPI` ใน `js/core/api.js`, เพิ่ม `API_BASE_URL` และ `GAS_API_URL` ใน `js/core/config.js` และปรับแต่ง Vite Config ให้รองรับ Production Build สมบูรณ์ |
| **Entry Point & Styling Resolution** | React SPA Entry Point & Tailwind CSS Integration | สร้างไฟล์ `src/main.jsx` เชื่อมต่อ `ThosbookProvider` กับ `AppRouter`, นำเข้า `css/theme.css` ครอบคลุม Tailwind Directives และตั้งค่า `index.html` ชี้ไปที่ Entry Point เพื่อแก้ปัญหา UI หลุด Styling |
| **Modular UI Components** | Reusable Functional Components (`src/components/`) | แยก UI ชิ้นส่วนซ้ำๆ ออกเป็น React Functional Components เช่น `BookCard.jsx`, `BorrowReturnModal.jsx`, `NotificationBadge.jsx`, `MobileBottomNav.jsx`, `ErrorBoundary.jsx` และ `OfflineBanner.jsx` |
| **Assembled Views & Layouts** | Main Dashboard Views (`src/views/`) | ประกอบ UI Components เข้าด้วยกันใน Views หลัก ได้แก่ `DashboardView.jsx` (Desktop), `MobileDashboardView.jsx` (Mobile), `CategoriesView.jsx`, `NotificationsView.jsx` และ `SettingsView.jsx` |
| **Routing & View Switching** | Client-Side SPA Router (`src/router/AppRouter.jsx`) | ระบบ View Switcher จัดการการเปลี่ยนหน้าระหว่าง Dashboard, Categories, Notifications และ Settings แบบ SPA เต็มรูปแบบ |
| **Production Reliability & Fallback** | Error Boundary & Offline Indicator | เพิ่ม `ErrorBoundary.jsx` ครอบ `AppRouter.jsx` เพื่อป้องกันแอปพลิเคชัน Crash หน้าขาว พร้อม `OfflineBanner.jsx` ตรวจจับและแจ้งเตือนเมื่อขาดอินเทอร์เน็ต |
| **Environment & GAS Integration** | Live Google Sheets Sync & Real Borrow-Return | เชื่อมต่อฟังก์ชันยืม-คืนหนังสือใน `BorrowReturnModal.jsx` และ `ThosbookAPI` เข้ากับ Google Sheets จริง พร้อมรองรับ `VITE_API_BASE_URL` Environment Variable บน Vercel |
| **Authentication & Authorization** | ระบบเข้าสู่ระบบ / ออกจากระบบ (Login / Logout) | ตรวจสอบสิทธิ์ผ่าน `login.html` และควบคุม Session ด้วย `js/core/auth.js` |
| **Legacy Sunset & Cleanup** | Modernized `index.html` & Archive Strategy | ทำการ Sunset และ Cleanup ไฟล์ HTML/JS เดิมฝั่ง Vanilla JS เข้าสู่ `legacy_archive/` และลบไฟล์ซ้ำซ้อนใน `src/components/AppRouter.js` |

---

## **3. Known Issues & Bugs (ปัญหาและ Error ที่พบในปัจจุบัน)**

> 1. **ข้อจำกัดของการดึงไฟล์เก็บบีบอัด (Archive Extraction Error):**  
   * **อาการ:** เกิดข้อผิดพลาดเมื่อพยายามแตกไฟล์บีบอัดประเภท RAR/Archive ในสภาพแวดล้อมระบบเนื่องจากขาดคำสั่ง unrar/7z  
   * **แนวทางแก้ไข:** ใช้การ Sync โดยตรงผ่าน GitHub Repository (https://github.com/Thosapon/thosbook) หรือใช้ไฟล์บีบอัดมาตรฐาน .zip  

### 3.1 Resolved Issues (ปัญหาที่แก้ไขเสร็จสิ้นแล้ว)

> 1. **UI ไม่ตรงกับ Figma Design System:**  
   * **อาการ:** สีธีม, Border และ Typography ของการ์ดหนังสือ (`BookCard.jsx`) แสดงผลเป็นโทนสี Default ของ Tailwind (Gray) แทนที่จะเป็นโทน Brand Navy ตาม Figma  
   * **สาเหตุ:** Component เรียกใช้ Utility Class มาตรฐานของ Tailwind (`text-gray-400`, `border-gray-100` ฯลฯ) แทนที่จะอ้างอิง Semantic Token ที่ตั้งไว้ใน `tailwind.config.js`  
   * **วิธีแก้:** ปรับ Class ใน `BookCard.jsx` ให้ใช้ Token ที่ถูกต้อง (`text-heading`, `text-body`, `text-muted`, `border-default`, `brand-blue-500`) — **สถานะ: แก้ไขแล้ว**

> 2. **ข้อมูลหนังสือ/หมวดหมู่ไม่แสดงผล (Dashboard ว่างเปล่า):**  
   * **อาการ:** การ์ดทุกใบแสดงเฉพาะค่า Fallback ("General") ไม่มี Title/Description และขึ้น Error "การเชื่อมต่อหมดเวลา (Timeout)"  
   * **สาเหตุ:** Google Apps Script Web App ตอบกลับด้วย HTTP 302 Redirect ไปยัง `script.googleusercontent.com` เพื่อส่งข้อมูลจริง แต่ Browser บล็อก Third-Party Cookie ระหว่าง Redirect ข้าม Domain ทำให้ Request ที่สองถูก `(canceled)` แม้ Apps Script Execution Log จะแสดงว่า `doGet` ทำงาน `Completed` สำเร็จทุกครั้งก็ตาม  
   * **วิธีแก้:** สร้าง `api/gas-proxy.js` เป็น Vercel Serverless Function ทำหน้าที่เรียก GAS แบบ Server-to-Server (ไม่ผ่าน Browser จึงไม่ติดปัญหา Cookie/CORS) แล้วเปลี่ยน `GAS_API_URL` ใน `js/core/api.js` ให้ชี้มาที่ `/api/gas-proxy` แทนการยิงตรงไปยัง GAS — **สถานะ: แก้ไขแล้ว**

> 3. **Serverless Function Crash (HTTP 500 / `FUNCTION_INVOCATION_FAILED`):**  
   * **อาการ:** หลังสร้าง `api/gas-proxy.js` เรียก API แล้วได้ Error 500 ทันที  
   * **สาเหตุ:** ยังไม่ได้เพิ่ม Environment Variable ชื่อ `GAS_API_URL` ใน Vercel Project Settings ทำให้ `process.env.GAS_API_URL` เป็น `undefined` และ `fetch()` throw Error  
   * **วิธีแก้:** เพิ่ม Environment Variable `GAS_API_URL` (ไม่ใส่ Prefix `VITE_` เพื่อไม่ให้ค่าถูก Bundle ไปฝั่ง Client) ครอบคลุมทุก Environment (Production/Preview/Development) แล้ว Redeploy — **สถานะ: แก้ไขแล้ว**

---

## **4. File Structure (โครงสร้างโฟลเดอร์และหน้าที่ของแต่ละไฟล์)**

Thosbook/  
├── index.html                   # หน้าแรก Entry Point สำหรับ React App Router (SPA)  
├── login.html                   # หน้าเข้าสู่ระบบ (Authentication)  
├── package.json                 # ไฟล์จัดการ Dependencies และ Build Scripts (Vite) — มี "type": "module"  
├── vite.config.js               # ไฟล์ตั้งค่า Vite Bundler & Manual Chunk Splitting  
├── vercel.json                  # ไฟล์ตั้งค่า Vercel Deployment & SPA Client-Side Rewrites  
├── postcss.config.js            # ไฟล์ตั้งค่า PostCSS สำหรับ Tailwind CSS & Autoprefixer  
├── tailwind.config.js           # ไฟล์ตั้งค่า Tailwind CSS (ES Module Export) รวม Semantic Design Tokens  
│  
├── api/                          # Vercel Serverless Functions  
│   └── gas-proxy.js              # Server-to-Server Proxy เรียก Google Apps Script แทน Client (แก้ปัญหา Third-Party Cookie/CORS), ใช้ Env Var `GAS_API_URL`  
│  
├── css/  
│   └── theme.css                # ไฟล์สไตล์ CSS หลัก Custom Theme & Override (รวม Tailwind Directives)  
│  
├── src/                         # โครงสร้างหลัก React Components & State  
│   ├── main.jsx                 # Entry Point หลักของ React SPA รวม Provider และ Global Styles  
│   ├── context/  
│   │   └── ThosbookContext.jsx  # Context API Provider จัดการ Global State, CRUD Operations & In-Memory TTL Cache  
│   ├── components/  
│   │   ├── BookCard.jsx         # React Functional Component แสดง Card รายการหนังสือ/บุ๊กมาร์ก — ใช้ Semantic Design Token (อัปเดตล่าสุด)  
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
│       ├── config.js            # ไฟล์กำหนดค่าส่วนกลาง (รองรับ VITE_API_BASE_URL, GAS_API_URL, API_BASE_URL)  
│       ├── api.js               # Centralized Service Layer พร้อม fetchApi, Timeout, Named/Default Exports — เรียกผ่าน `/api/gas-proxy` แทนการยิงตรงไป GAS (อัปเดตล่าสุด)  
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

---

## **6. Environment Variables Checklist**

| ตัวแปร | ใช้ที่ไหน | หมายเหตุ |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | Client (Build-time, ถูก Bundle เข้า JS) | ใช้อ้างอิง Base URL ทั่วไปฝั่ง Frontend |
| `GAS_API_URL` | Server เท่านั้น (`api/gas-proxy.js`) | เก็บ URL จริงของ Google Apps Script `/exec` ห้ามใส่ Prefix `VITE_` เด็ดขาด เพราะจะถูก Expose ให้ Client เห็น |
