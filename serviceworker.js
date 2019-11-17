var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  '/',
//   '/styles/main.css',
    '/fallback.json',
    '/js/jquery.js',
    '/js/main.js',
    '/images/logo.png'
];

// install service worker
self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('in install serviceworker... cache opened!');
        return cache.addAll(urlsToCache);
      })
  );
});

// activate service worker
self.addEventListener('activate', function(event) {

    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
            cacheNames.filter(function(cacheName){
                // console.log('Ini cache aktif skrng : '.CACHE_NAME);
                return cacheName != CACHE_NAME;
            }).map(function(cacheName){
                return caches.delete(cacheName);
            })
        );
      })
    );
  });

  // cache and return request
  self.addEventListener('fetch', function(event) {
    
     var request = event.request;
     var url = new URL(request.url);
     
     // pisahkan request API dan Internal
     if (url.origin === location.origin){ 
        event.respondWith(
           caches.match(request).then(function(response){
               return response || fetch(request)
           })
        );
     }else{

       // cek cache dengan open product cache jika tak ada data return fallback.json 
       event.respondWith(
           caches.open('products-cache').then(function(cache){
               return fetch(request).then(function(liveResponse){
                  cache.put(request, liveResponse.clone())
                  return liveResponse 

               }).catch(function(){
                   return caches.match(request).then(function(response){
                       if (response)return response 
                       return caches.match('/fallback.json')
                   })
               })
           })
       ) // end responseWidth

     } // end else

    
  });