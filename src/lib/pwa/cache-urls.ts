const CACHEABLE_PREFIXES = ["/_next/static/", "/icons/", "/screenshots/"] as const;

/**
 * Picks the same-origin static assets worth caching for offline use from a list of
 * resource URLs (as reported by the Performance API). The service worker only controls
 * pages after the first load, so the page hands it what it has already fetched.
 */
export const collectCacheUrls = (urls: readonly string[], origin: string): string[] => {
  const found = new Set<string>();
  for (const raw of urls) {
    let url: URL;
    try {
      url = new URL(raw, origin);
    } catch {
      continue;
    }
    if (url.origin !== origin) continue;
    if (!CACHEABLE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) continue;
    found.add(url.pathname + url.search);
  }
  return [...found];
};
