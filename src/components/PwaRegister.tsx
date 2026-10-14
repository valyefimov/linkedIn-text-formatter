"use client";

import { useEffect } from "react";
import { collectCacheUrls } from "@/lib/pwa/cache-urls";

/** Registers the service worker in production and hands it the assets this page already loaded. */
export const PwaRegister = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        await navigator.serviceWorker.register("/sw.js", { scope: "/" });
        const { active } = await navigator.serviceWorker.ready;
        const loaded = performance.getEntriesByType("resource").map((entry) => entry.name);
        active?.postMessage({
          type: "CACHE_URLS",
          urls: [location.pathname, ...collectCacheUrls(loaded, location.origin)],
        });
      } catch {
        // Offline support is an enhancement: the app works without it.
      }
    };

    if (document.readyState === "complete") void register();
    else {
      window.addEventListener("load", () => void register(), { once: true });
    }
  }, []);

  return null;
};
