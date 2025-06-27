const CACHE_STATIC_NAME = "static-v1";
const CACHE_DYNAMIC_NAME = "dynamic-v1";


self.addEventListener("install", function (e) {
    e.waitUntil(
        caches.open(CACHE_STATIC_NAME).then(function (cache) {
            return cache.addAll(["/index.html", "/index.css", "/offline.html", "adminHome.html","adminSubmissions.html","adminUsers.html","home.html","submissions.html","settings.html","illustratorHome.html","illustratorSubmissions.html","illustratorSettings.html","signUp.html","specialHome.html","specialSubmissions.html","specialSettings.html","/index.js", "adminHome.js","adminSubmissions.js","adminUsers.js","home.js","submissions.js","illustratorHome.js","illustratorSubmissions.js","illustratorSettings.js","settings.js","signUp.js","specialHome.js","specialSubmissions.js","specialSettings.js"]);
        })
    );
});

self.addEventListener("fetch", function (e) {
    async function handleNavigationRequest(request) {
        try {
            const networkResponse = await fetch(request);
            return networkResponse;
        } catch (error) {
            console.log("Fetch failed; returning offline page instead.", error);

            const cache = await caches.open(CACHE_STATIC_NAME);
            const cachedResponse = await cache.match(OFFLINE_URL);
            return cachedResponse;
        }
    }

    if (e.request.mode === "navigate") {
        e.respondWith(handleNavigationRequest(e.request));
    } else {
        e.respondWith(
            caches.match(e.request).then(function (response) {
                if (response) {
                    return response;
                } else {
                    return fetch(e.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_NAME).then(function (cache) {
                                cache.put(e.request.url, res.clone());
                                return res;
                            });
                        })
                        .catch(function (err) {
                            console.log(err);
                        });
                }
            })
        );
    }
});