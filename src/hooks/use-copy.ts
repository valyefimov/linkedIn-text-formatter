"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const RESET_MS = 1600;

const writeClipboard = async (text: string): Promise<void> => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const area = document.createElement("textarea");
  area.value = text;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  const ok = document.execCommand("copy");
  area.remove();
  if (!ok) throw new Error("Copy failed");
};

/** Copies text and exposes the key of whatever was copied for a short moment, for button feedback. */
export const useCopy = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async (text: string, key = "default"): Promise<boolean> => {
    try {
      await writeClipboard(text);
    } catch {
      return false;
    }
    setCopiedKey(key);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopiedKey(null), RESET_MS);
    return true;
  }, []);

  return { copiedKey, copy };
};
