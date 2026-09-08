# 📌 Document Index & Outline

| ลำดับที่ | หัวข้อหลัก | หัวข้อย่อย / รายละเอียดสังเขป |
| :---: | :--- | :--- |
| **1** | **Project Overview** | ภาพรวมระบบ, เป้าหมายหลัก และสถาปัตยกรรม (Architecture) |
| **2** | **Role-Based Access Control (RBAC)** | รายละเอียดสิทธิ์การใช้งานของ Admin และ Viewer |
| **3** | **File Structure & Map** | โครงสร้างไฟล์ทั้งหมดในระบบและหน้าที่ของแต่ละไฟล์ |
| **4** | **Backend API & Data Schema** | การทำงานของ Google Apps Script (`Code.gs`) และโครงสร้าง Google Sheets |
| **5** | **UI/UX Guidelines** | ธีมสี, ฟอนต์, ไอคอน และองค์ประกอบ Design System |

---

## 1. Project Overview
**Thosbook** คือเว็บแอปพลิเคชันสำหรับการบริหารจัดการลิงก์และบันทึกข้อความ (Bookmarking & Notes Web Application) ที่ทำงานแบบ Serverless โดยใช้ Front-end เชื่อมโยงข้อมูลกับ Google Apps Script (GAS) และใช้ Google Sheets เป็นฐานข้อมูลหลัก

* **Architecture**: Front-end (HTML5 / Tailwind CSS / Vanilla JS) ⟷ POST/GET JSON ⟷ Backend API (Google Apps Script) ⟷ Database (Google Sheets)
* **Design Philosophy**: Minimal, Clean, Responsive (รองรับ Sidebar ซ่อน-แสดงได้)

---

## 2. Role-Based Access Control (RBAC)

ระบบแยกการทำงานตามสิทธิ์ของผู้ใช้งานออกเป็น 2 กลุ่มอย่างชัดเจน:

* 👑 **Admin Role**
  * **Dashboard (`dashboard.html`)**: อ่าน, ค้นหา, สร้าง Bookmark, สร้าง Category, แก้ไข/ลบ Bookmark บน Card, และแก้ไข/ลบ Category จาก Sidebar
  * **Admin Panel (`admin-manage.html`)**: เข้าถึงหน้าการจัดการบัญชีผู้ใช้ (User Management) เพิ่ม/แก้ไข/ลบ สิทธิ์ผู้ใช้งานได้
* 👁️ **Viewer Role**
  * **Dashboard (`dashboard.html`)**: อ่านข้อมูล, ค้นหา, กรองตามหมวดหมู่, และเปิดลิงก์ได้เท่านั้น (ไม่ปรากฏไอคอน Edit/Delete และปุ่มเข้าหน้า Admin Panel)

---

## 3. File Structure & Map

```text
Thosbook-Project/
├── 📄 index.html          # หน้าแรกสำหรับตรวจสอบ Session และ Redirect
├── 📄 login.html          # หน้าเข้าสู่ระบบ (พร้อม Toggle Password Visibility)
├── 📄 dashboard.html      # หน้าแสดงผลหลัก (Main Workspace)
├── 📄 admin-manage.html   # หน้าจัดการผู้ใช้งานสำหรับ Admin (User Management)
├── ⚙️ config.js            # เก็บค่าตัวแปรระดับ Global (API URL Endpoint)
├── 📜 app.js              # Core Logic (ดึงข้อมูล Bookmark/Category, Lightbox, Compress รูป)
├── 📜 script.js           # Dashboard UI Logic & Admin Action Overrides
├── 📜 admin.js            # User Management Logic สำหรับหน้า admin-manage.html
└── ⚙️ Code.gs             # Backend Web App Script บน Google Apps Script