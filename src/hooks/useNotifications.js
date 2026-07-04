// src/hooks/useNotifications.js
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserNotifications, markAsRead, markAllAsRead } from "../services/notificationService";

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const items = await getUserNotifications(user.uid);
      setNotifications(items);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function readOne(id) {
    await markAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  async function readAll() {
    if (!user) return;
    await markAllAsRead(user.uid);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return { notifications, unreadCount, loading, refresh, readOne, readAll };
}
