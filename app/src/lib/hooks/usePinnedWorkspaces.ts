"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "agora:pinned-workspaces";

export function usePinnedWorkspaces() {
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      if (Array.isArray(parsed)) {
        setPinnedIds(parsed.filter((id): id is string => typeof id === "string"));
      }
    } catch {
      setPinnedIds([]);
    }
    setReady(true);
  }, []);

  const persist = useCallback((ids: string[]) => {
    const next = ids.slice(0, 4);
    setPinnedIds(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch { /* quota exceeded — ignore */ }
  }, []);

  const isPinned = useCallback((id: string) => pinnedIds.includes(id), [pinnedIds]);

  const togglePin = useCallback((id: string) => {
    setPinnedIds((prev) => {
      const isAlready = prev.includes(id);
      if (isAlready) {
        const next = prev.filter((pid) => pid !== id);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      }
      if (prev.length >= 4) {
        const next = [...prev.slice(1), id];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      }
      const next = [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { pinnedIds, isPinned, togglePin, pinLimitReached: pinnedIds.length >= 4, ready, persist };
}
