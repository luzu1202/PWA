"use strict";

const CACHE_VERSION = "dulce-pausa-v7";
const APP_CACHE = `${CACHE_VERSION}-app`;
const PHOTO_CACHE = `${CACHE_VERSION}-photos`;
const FALLBACK_IMAGE = "./assets/postre-placeholder.svg";
const APP_ASSETS = [
  "./",
  "./index.html",
  "./styles.css?v=tiramisu-center",
  "./script.js",
  "./manifest.json",
  "./assets/icon.svg",
  FALLBACK_IMAGE
];
const DESSERT_PHOTOS = [
  "photo-1571877227200-a0d98ea607e9",
  "photo-1606313564200-e75d5e30476c",
  "photo-1578985545062-69928b1d9587",
  "photo-1519915028121-7d3463d20b13",
  "photo-1533134242443-d4fd215305ad",
  "photo-1624371414361-e670edf4898d",
  "photo-1499636136210-6f4ee915583e",
  "photo-1653988354010-39637252a2db",
  "photo-1568571780765-9276ac8b75a2"
].map((id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`);

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const appCache = await caches.open(APP_CACHE);
    await appCache.addAll(APP_ASSETS);
    const photoCache = await caches.open(PHOTO_CACHE);
    await Promise.allSettled(DESSERT_PHOTOS.map(async (url) => {
      const request = new Request(url, { mode: "no-cors" });
      const response = await fetch(request);
      if (response.ok || response.type === "opaque") await photoCache.put(request, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.filter((name) => name.startsWith("dulce-pausa-") && ![APP_CACHE, PHOTO_CACHE].includes(name)).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response.ok) {
          const cache = await caches.open(APP_CACHE);
          await cache.put("./index.html", response.clone());
        }
        return response;
      } catch {
        return (await caches.match("./index.html")) || Response.error();
      }
    })());
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok) (await caches.open(APP_CACHE)).put(request, response.clone());
        return response;
      } catch {
        if (request.destination === "image") return (await caches.match(FALLBACK_IMAGE)) || Response.error();
        return Response.error();
      }
    })());
    return;
  }

  if (url.hostname === "images.unsplash.com") {
    event.respondWith((async () => {
      const cache = await caches.open(PHOTO_CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response.ok || response.type === "opaque") await cache.put(request, response.clone());
        return response;
      } catch {
        return (await caches.match(FALLBACK_IMAGE)) || Response.error();
      }
    })());
  }
});
