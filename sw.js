// Register a Service Woker //
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
      navigator.serviceWorker.register('/sw.js').then(function(registration) {
        // Registration was successful
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, function(err) {
        // registration failed :(
        console.log('ServiceWorker registration failed: ', err);
      });
    });
  }

var filesToCache = [
    '/main.js',
    '/index.css'
]

var cache_name = 'static-files-cache';

// Open the cache and store the local files on it //
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cache_name).then((cache) => {
            return cache.addAll(filesToCache);
        })
    )
});

self.addEventListener('fetch', (event) => {

    if(event.request.url == 'http://localhost:8000/index.html') return fetch(event.request);


    self.addEventListener('fetch', function(event) {
        event.respondWith(
          caches.open('mysite-dynamic').then(function(cache) {
            return cache.match(event.request).then(function (response) {
                if(response) {
                    console.log('Loaded from SW Cache ' + event.request.url);
                    return response;
                }
              return fetch(event.request).then(function(response) {
                cache.put(event.request, response.clone());
                return response;
              });
            });
          })
        );
      });
})
