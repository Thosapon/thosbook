# **ข้อตกลงและแนวทางการเขียนโค้ด (CONVENTIONS.md)**

## **1\. Component Structure & React Patterns**

> * **Functional Components & React Hooks:** ต้องใช้ Functional Components ร่วมกับ React Hooks (เช่น useState, useEffect, useContext, useCallback, useMemo) เท่านั้น ห้ามใช้ Class Components  
> * **Clean & Modular Code:** แยก Components ออกเป็นส่วนย่อยๆ ตามหลัก Single Responsibility Principle เพื่อความสะดวกในการดูแลรักษาและ Reusability

## **2\. State Management Rules**

> * **Context API Only:** การจัดการ Global State หรือ Shared State ภายในแอปพลิเคชัน ให้ใช้ **React Context API** เท่านั้น  
> * **No External Redux State Managers:** **ห้ามใช้ Redux**, Redux Toolkit, Zustand, MobX หรือ Global State Library อื่นๆ นอกเหนือจาก Context API

## **3\. Styling Guidelines**

> * **Tailwind CSS:** ใช้ **Tailwind CSS** ในการปรับแต่งสไตล์ (Styling) เป็นหลักผ่าน Utility Classes  
> * **Responsive & Mobile-First:** เขียน Tailwind classes รองรับ Responsive Design (เช่น sm:, md:, lg:) ตามโครงสร้าง UI ของโปรเจกต์

## **4\. Code Editing & Output Guidelines**

> * **Partial Code Updates:** เมื่อมีการแก้ไขหรือพัฒนาโค้ด ให้ส่งกลับเฉพาะ**ฟังก์ชัน, Component หรือ Block โค้ดส่วนที่แก้ไข/เพิ่มใหม่** พร้อมระบุบริบทของตำแหน่งที่แก้ไข  
> * **No Full File Dumps:** **ไม่ต้องส่งโค้ดทั้งหมดทั้งไฟล์** เพื่อป้องกันความสับสนและช่วยให้การปรับปรุงโค้ดกระชับ เข้าใจง่าย