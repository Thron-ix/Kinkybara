const CACHE_NAME = "kinkybara-shell-v30";
const APP_SHELL = Object.freeze([
  "./index.html",
  "./styles.css",
  "./assets/pup-hood-base.png",
  "./assets/pup-hood-primary-mask.png",
  "./assets/pup-hood-secondary-mask.png",
  "./assets/pack-cards-joker.png",
  "./assets/kennel-fruit-pair.png",
  "./assets/gear-locker.png",
  "./assets/friend-book.png",
  "./game-core.js",
  "./pet-art.js",
  "./dialogues.js",
  "./pet-library.js",
  "./quest-core.js",
  "./quest-games.js",
  "./pack-cards.js",
  "./travel-core.js",
  "./weather.js",
  "./inventory-core.js",
  "./world-core.js",
  "./i18n.js",
  "./app.js",
  "./manifest.webmanifest",
]);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const requests = APP_SHELL.map((url) => new Request(new URL(url, self.registration.scope), { cache: "reload" }));
    await cache.addAll(requests);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function cachedShellResponse(request) {
  const cache = await caches.open(CACHE_NAME);
  const cacheKey = request.mode === "navigate"
    ? new Request(new URL("./index.html", self.registration.scope))
    : request;
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(cacheKey, response.clone());
    return response;
  } catch {
    return new Response("Kinkybara is offline and this local file is not cached yet.", {
      status: 503,
      headers: { "content-type": "text/plain; charset=utf-8" },
    });
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(cachedShellResponse(request));
});
