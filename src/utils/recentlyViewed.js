// src/utils/recentlyViewed.js
// Client-side recently viewed tracker (localStorage) for students.
const KEY = "cs_portal_recently_viewed";
const MAX = 20;

export function getRecentlyViewed() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item) {
  const list = getRecentlyViewed().filter((i) => i.id !== item.id || i.type !== item.type);
  list.unshift({ ...item, viewedAt: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
}

export function clearRecentlyViewed() {
  localStorage.removeItem(KEY);
}
