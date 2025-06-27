const CACHE_STATIC_NAME = "static-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(function (cache) {
            return cache.addAll([
                "/offline.html",
                "/index.css",
                "assets/Ajudaris.png",
                "assets/file-earmark.svg",
                "assets/file-image.svg",
                "assets/file-refresh.svg",
                "assets/gear-fill.svg",
                "assets/house.svg",
                "assets/icon512_maskable.png",
                "assets/icon512_rounded.png",
                "assets/image-refresh.svg",
                "assets/pencil.svg",
                "assets/person.svg",
                "assets/shield.svg",
                "assets/trash.svg",
                "assets/upload.svg"
            ]);
        })
    );
});

self.addEventListener("fetch", function (e) {
    // Network first for navigation and API requests, no dynamic caching
    if (
        e.request.mode === "navigate" ||
        e.request.url.includes("/api/") ||
        e.request.url.includes("/submissions") ||
        e.request.url.includes("/users") ||
        e.request.url.includes("/ajudaris")
    ) {
        e.respondWith(
            fetch(e.request)
                .then(function (res) {
                    return res;
                })
                .catch(function () {
                    // If network fails, show offline page for navigation, or nothing for API
                    if (e.request.mode === "navigate") {
                        return caches.match(OFFLINE_URL);
                    }
                    return new Response("", { status: 503, statusText: "Offline" });
                })
        );
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                return response || fetch(e.request);
            })
        );
    }
});