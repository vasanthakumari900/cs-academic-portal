// src/hooks/useInfiniteScroll.js
import { useEffect, useRef, useCallback } from "react";

export function useInfiniteScroll(onLoadMore, hasMore, loading) {
  const observerRef = useRef(null);

  const lastRef = useCallback(
    (node) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) onLoadMore();
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore, onLoadMore]
  );

  useEffect(() => () => observerRef.current?.disconnect(), []);

  return lastRef;
}
