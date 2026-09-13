"use client";

import { type Dispatch, type SetStateAction, useEffect, useState } from "react";

/**
 * `useState` mirrored to `localStorage`. The stored value is read in an effect so the
 * server render and first client render match; `ready` flips once it has been loaded.
 */
export const usePersistentState = <T,>(key: string, initial: T): [T, Dispatch<SetStateAction<T>>, boolean] => {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      // Storage unavailable or corrupted: fall back to the initial value.
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Quota exceeded or private mode: persistence is best effort.
    }
  }, [key, value, ready]);

  return [value, setValue, ready];
};
