"use client";

// ============================================================
// InvoForge — useLocalStorage Hook
// Developer: Ritwik Das | ritwikdas100@gmail.com
// ============================================================

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`[InvoForge] localStorage read error for key "${key}":`, error);
      }
      setIsHydrated(true);
    });
  }, [key]);

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        setStoredValue((prev) => {
          const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
          window.localStorage.setItem(key, JSON.stringify(next));
          return next;
        });
      } catch (error) {
        console.warn(`[InvoForge] localStorage write error for key "${key}":`, error);
      }
    },
    [key]
  );

  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`[InvoForge] localStorage remove error for key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [isHydrated ? storedValue : initialValue, setValue, removeValue];
}
