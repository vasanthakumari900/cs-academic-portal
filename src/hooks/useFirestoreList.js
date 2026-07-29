// src/hooks/useFirestoreList.js
// Enhanced hook that automatically attaches a Firebase onSnapshot real-time listener when available.

import { useEffect, useState, useCallback } from "react";

export function useFirestoreList(service, filters = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterKey = JSON.stringify(filters);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // If service supports real-time onSnapshot subscription
    if (typeof service?.subscribe === "function") {
      const unsubscribe = service.subscribe({
        ...filters,
        callback: (data) => {
          setItems(data);
          setLoading(false);
        },
      });

      return () => {
        if (typeof unsubscribe === "function") unsubscribe();
      };
    }

    // Fallback async fetch
    async function loadData() {
      try {
        const data = await service.list(filters);
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [service, filterKey]);

  const refetch = useCallback(async () => {
    if (typeof service?.list === "function") {
      const data = await service.list(filters);
      setItems(data);
    }
  }, [service, filterKey]);

  return { items, loading, error, refetch };
}
