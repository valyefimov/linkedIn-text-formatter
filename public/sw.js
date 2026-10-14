// Minimal offline support, no dependencies.
//  - Pages: network first, fall back to the last cached copy (or the home page).
//  - Hashed build assets and icons: cache first (they never change for a given URL).
//  - Everything else on this origin: stale while revalidate.
// The page also sends the assets it already loaded (message "CACHE_URLS") because a service
// worker does not control the very first page load.
const VERSION = "ltf-v4";
const SHELL = ["/", "/about", "/privacy", "/terms"];
const IMMUTABLE_PREFIXES = ["/_next/static/", "/icons/", "/screenshots/"];

const putInCache = async (request, response) => {
  if (!response || !response.ok || response.type === "opaque") return response;
  const cache = await caches.open(VERSION);
  await cache.put(request, response.clone());
  return response;
};

const networkFirst = async (request) => {
  try {
    return await putInCache(request, await fetch(request));
  } catch {
    const cached = await caches.match(request);
    return cached ?? (await caches.match("/")) ?? Response.error();
  }
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  return cached ?? putInCache(request, await fetch(request));
};

const staleWhileRevalidate = async (request) => {
  const cached = await caches.match(request);
  const refreshed = fetch(request).then((response) => putInCache(request, response)).catch(() => undefined);
  return cached ?? (await refreshed) ?? Response.error();
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => Promise.allSettled(SHELL.map((url) => cache.add(url))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_URLS" || !Array.isArray(event.data.urls)) return;
  event.waitUntil(
    caches.open(VERSION).then((cache) => Promise.allSettled(event.data.urls.map((url) => cache.add(url)))),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request));
  } else if (IMMUTABLE_PREFIXES.some((prefix) => url.pathname.startsWith(prefix))) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
