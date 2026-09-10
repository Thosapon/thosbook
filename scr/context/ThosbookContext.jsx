// ตำแหน่งที่แก้ไข: src/context/ThosbookContext.jsx (แก้ไข State Mismatch, ใส่ In-Memory Caching & Cache Invalidation)

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ThosbookAPI } from '../../js/core/api.js';

const ThosbookContext = createContext();

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 นาที Cache Expiry Period

export function ThosbookProvider({ children }) {
  // 1. Unified State Declarations
  const [bookmarks, setBookmarks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cache State Tracker
  const [cache, setCache] = useState({
    lastFetched: null,
    isStale: true
  });

  // Helper สำหรับสั่งล้าง Cache เมื่อมีการทำ CRUD
  const invalidateCache = useCallback(() => {
    setCache(prev => ({ ...prev, isStale: true }));
  }, []);

  /**
   * Fetch Initial / Normalized Dashboard & Category Data with In-Memory Caching
   * @param {boolean} forceRefresh - บังคับดึงข้อมูลใหม่โดยข้าม Cache
   */
  const fetchInitialData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // ตรวจสอบเงื่อนไข Cache TTL (ถ้าข้อมูลไม่ Stale และยังไม่หมดอายุ ให้ข้ามการยิง API)
    if (!forceRefresh && !cache.isStale && cache.lastFetched && (now - cache.lastFetched < CACHE_TTL_MS)) {
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await ThosbookAPI.getNormalizedDashboardData();
      if (res.success) {
        setCategories(res.data.categories || []);
        setBookmarks(res.data.bookmarks || []);
        // อัปเดตสถานะ Cache
        setCache({ lastFetched: Date.now(), isStale: false });
      } else {
        setError(res.error || 'เกิดข้อผิดพลาดในการดึงข้อมูล');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อระบบได้');
    } finally {
      setIsLoading(false);
    }
  }, [cache]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  // 2. Centralized CRUD Actions for Bookmarks (พร้อม Cache Invalidation)
  const addBookmark = async (bookmarkData) => {
    setIsLoading(true);
    const res = await ThosbookAPI.addBookmark(bookmarkData);
    if (res.success) {
      setBookmarks((prev) => [res.data || bookmarkData, ...prev]);
      invalidateCache();
    } else {
      setError(res.error || 'เพิ่มบุ๊กมาร์กล้มเหลว');
    }
    setIsLoading(false);
    return res;
  };

  const updateBookmark = async (id, data) => {
    setIsLoading(true);
    const res = await ThosbookAPI.updateBookmark(id, data);
    if (res.success) {
      setBookmarks((prev) => prev.map((bm) => (bm.id === id ? { ...bm, ...data } : bm)));
      invalidateCache();
    } else {
      setError(res.error || 'แก้ไขบุ๊กมาร์กล้มเหลว');
    }
    setIsLoading(false);
    return res;
  };

  const deleteBookmark = async (id) => {
    setIsLoading(true);
    const res = await ThosbookAPI.deleteBookmark(id);
    if (res.success) {
      setBookmarks((prev) => prev.filter((item) => item.id !== id));
      invalidateCache();
    } else {
      setError(res.error || 'ลบบุ๊กมาร์กล้มเหลว');
    }
    setIsLoading(false);
    return res;
  };

  // 3. Centralized CRUD Actions for Categories (พร้อม Cache Invalidation)
  const addCategory = async (categoryData) => {
    setIsLoading(true);
    const res = await ThosbookAPI.addCategory(categoryData);
    if (res.success) {
      setCategories((prev) => [...prev, res.data || categoryData]);
      invalidateCache();
    } else {
      setError(res.error || 'เพิ่มหมวดหมู่ล้มเหลว');
    }
    setIsLoading(false);
    return res;
  };

  const updateCategory = async (id, data) => {
    setIsLoading(true);
    const res = await ThosbookAPI.updateCategory(id, data);
    if (res.success) {
      setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...data } : cat)));
      invalidateCache();
    } else {
      setError(res.error || 'แก้ไขหมวดหมู่ล้มเหลว');
    }
    setIsLoading(false);
    return res;
  };

  const deleteCategory = async (id) => {
    setIsLoading(true);
    const res = await ThosbookAPI.deleteCategory(id);
    if (res.success) {
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
      invalidateCache();
    } else {
      setError(res.error || 'ลบหมวดหมู่ล้มเหลว');
    }
    setIsLoading(false);
    return res;
  };

  // Filtered Data Computation
  const filteredBookmarks = bookmarks.filter((item) => {
    const matchCat = currentCategory === 'all' || item.category_id === currentCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchQuery = !query || 
      item.title?.toLowerCase().includes(query) ||
      item.content?.toLowerCase().includes(query) ||
      item.url?.toLowerCase().includes(query);
    return matchCat && matchQuery;
  });

  const value = {
    categories,
    bookmarks: filteredBookmarks,
    currentCategory,
    setCurrentCategory,
    searchQuery,
    setSearchQuery,
    isLoading,
    error,
    refreshData: () => fetchInitialData(true), // บังคับดึงข้อมูลใหม่
    addBookmark,
    updateBookmark,
    deleteBookmark,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <ThosbookContext.Provider value={value}>
      {children}
    </ThosbookContext.Provider>
  );
}

export const useThosbook = () => {
  const context = useContext(ThosbookContext);
  if (!context) {
    throw new Error('useThosbook ต้องใช้งานภายใต้ <ThosbookProvider>');
  }
  return context;
};