importScripts("_arq/localforage.js");
importScripts("_arq/db.config.js");
importScripts("_js/bin/getData.js");
importScripts("_js/bin/swConections.js");
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const PRECACHE = 'Yetu_precache-v1';
const RUNTIME = 'Yetu_runtime-v1';

// A list of local resources we always want to be cached.
const PRECACHE_URLS = [
    'index.php',
    'acaminho.php',
    'cadastrar.php',
    'comprar.php',
    'compras.php',
    'conta.php',
    'esqueci.php',
    'login.php',
    'n.php',
    'p.php',
    's.php',
    'recebercodigo.php',
    'validarcodigo.php',
    'app.php',
    '_arq/debliwui-menu.js',
    '_arq/bootstrap.min.css',
    '_arq/bootstrap.min.js',
    '_arq/db.config.js',
    '_arq/Inter-Regular.ttf',
    '_arq/jquery.js',
    '_arq/lightslider.css',
    '_arq/lightslider.js',
    '_css/card-itens.css',
    '_css/cesto.css',
    '_css/compras.css',
    '_css/conta.css',
    '_css/header.css',
    '_css/one.css',
    '_css/pes.css',
    '_css/produto.css',
    '_css/slide-sugestao.css',
    '_css/slide.css',
    '_icones/',
    '_js/loader.js',
    '_js/one.js',
    '_js/routes.js',
    '_js/slide-card.js',
    '_js/slide-grosso.js',
    '_js/slide-sugestao.js',
    '_js/slide-um.js',
    '_js/paginas/compras.js',
    '_js/paginas/conta.js',
    '_js/bin/card-itens.js',
    '_js/bin/carrinho-adiciona.js',
    '_js/bin/carrinho.js',
    '_js/bin/categorias.js',
    '_js/bin/func.pesquisar.js',
    '_partes/card-itens.php',
    '_partes/css.php',
    '_partes/header.php',
    '_partes/pes.php',
    '_partes/script.php',
    '_partes/slide-card.php',
    '_partes/slide-grosso.php',
    '_partes/slide-sugestao.php',
    '_partes/slide-um.php'
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
    console.log();
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
self.addEventListener('fetch', function(event) {
    // Skip cross-origin requests, like those for Google Analytics.


    //console.log(event.request);
    if (event.request.method == "POST") {

    } else {
        if (navigator.onLine) {
            resposta_online(event);
        } else {
            resposta_offline(event);
        }


    }

});


self.addEventListener('sync', function(event) {
    //console.log(event);
    if (event.tag === 'sincronizar') {
        //event.waitUntil(sendOutboxMessages());

        pegaProdutos();
        pegaSugestoes();
        pegaCategorias();
        pegaSlide();
        pegaCestaBasica();

        tbUser.getItem("token").then(function(token) {
            if (token) {
                pegaUser(token);
                pegaCompras(token);
            }
        })

    }
});

function mostrarNotificacao(self, res) {
    var result = JSON.parse(res);
    var notify = self.registration.showNotification(result.title, result);

}

self.addEventListener('notificationclick', function(e) {
    e.notification.close();
    //console.log(e);
    if (e.action == "Abrir") {
        //console.log(e.notification.data);
        //clients.openWindow("p.php?" + e.notification.data);

        clients.openWindow(".");
    }
})