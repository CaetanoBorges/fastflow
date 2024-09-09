
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'REST_precache-v1';
const RUNTIME = 'REST_runtime-v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'index.html',
    'back.jpg',
    'router.js',
    'assets/',
    'pages/',
    'components/'
];

// The install handler takes care of precaching the resources we always need.
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(PRECACHE)
        .then(cache => cache.addAll(PRECACHE_URLS))
        .then(self.skipWaiting())
    );
});



// The activate handler takes care of cleaning up old caches.
self.addEventListener('activate', event => {

    const currentCaches = [PRECACHE, RUNTIME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
        }).then(cachesToDelete => {
            return Promise.all(cachesToDelete.map(cacheToDelete => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.

function resposta_offline(event) {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return caches.open(RUNTIME).then(cache => {
                //cache.delete('suave/clientes/clientes.php');
                //cache.delete('suave/controle/controle.php');
                //cache.delete('suave/definicoes/definicoes.php');
                //cache.delete('suave/registar/faturar.php');
                //cache.delete('suave/registos/faturas.php');
                //cache.delete('suave/rh/rh.php');
                //cache.delete('suave/stocks/stocks.php');
                return fetch(event.request).then(response => {
                    //console.log(response);
                    // Put a copy of the response in the runtime cache.
                    return cache.put(event.request, response.clone()).then(() => {
                        return response;
                    });
                });
            });
        })
    );
}

self.addEventListener('push', (e) => {
    console.log(e);
    mostrarNotificacao(self, e.data.text());
});



function resposta_online(event) {
    fetch(event.request).then((response) => {
        //console.log('fetched from network this time!');
        return caches.open(RUNTIME).then((cache) => {
            //cache.put(event.request, response.clone());
            return response;
        });

    })
}


function mostrarNotificacao(self, res) {
    var result = JSON.parse(res);
    var notify = self.registration.showNotification(result.title, result);

}

self.addEventListener('notificationclick', function(e) {
    console.log(e);
    e.notification.close();
    //console.log(e);
    if (e.action == "Abrir") {
        //console.log(e.notification.data);
        //clients.openWindow("p.php?" + e.notification.data);

        //clients.openWindow(".");
    }
})