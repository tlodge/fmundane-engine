const filesToCache = [
    'tbu-pos-noscifi-warm.mp4',
    'tbu-pos-noscifi-cold.mp4',
    'tbu-neg-noscifi-cold.mp4',	
    'tbu-neg-noscifi-warm.mp4',	

    'tbu-pos-scifi-cold.mp4',		
    'tbu-pos-scifi-warm.mp4',
    'tbu-neg-scifi-cold.mp4',			
    'tbu-neg-scifi-warm.mp4',		
    
];
  
  const staticCacheName = 'media-cache';
  
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
      })
    );
  });

  self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request)
      .then(response => {
        if (response) {
          console.log('Found ', event.request.url, ' in cache');
          return response;
        }
        return fetch(event.request)
      }).catch(error => {
      })
    );
  });