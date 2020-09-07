// Imports
importScripts('js/sw-utils.js')


// 1) Declarar las variables donde se almacenarán los cachés

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

// 2) Configurar la App Shell 
// La APP SHELL va a contener todo lo que es necesario para mi aplicación

// Es lo que debería de estar cargado de manera instantánea o lo más rápido posible
const APP_SHELL = [
  '/',
  'index.html',
  'css/style.css',
  'img/favicon.ico',
  'img/avatars/hulk.jpg',
  'img/avatars/ironman.jpg',
  'img/avatars/spiderman.jpg',
  'img/avatars/thor.jpg',
  'img/avatars/wolverine.jpg',
  'js/app.js',
  'js/sw-utils.js'
]

// El inmutable es todo lo que no se va a modificar jamás
const APP_SHELL_INMUTABLE = [
  'https://fonts.googleapis.com/css?family=Quicksand:300,400',
  'https://fonts.googleapis.com/css?family=Lato:400,300',
  'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
  'css/animate.css',
  'js/libs/jquery.js'
]

// INSTALACIÓN
// 1) Almacenar en el caché el app shel y el inmutable en sus respectivos lugares
self.addEventListener('install', e => {

  const cacheStatic = caches.open(STATIC_CACHE)
    .then(cache =>
      cache.addAll(APP_SHELL));
  
  const cacheInmutable = caches.open(INMUTABLE_CACHE)
      .then(cache => 
        cache.addAll(APP_SHELL_INMUTABLE));
  
  e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));

})

// ACTIVACIÓN
// 1) Incluir proceso para que cada vez que se cambie el SW
// se borren los caches anteriores que ya no van a servir 

self.addEventListener('activate', e => {

  // Verificar si la versión actual del caché, la que se encuentra en este SW
  // es la misma de la que se encuentra activo o no. Si hay alguna diferencia entonces hay que borrar el caché estático
  const respuesta = caches.keys().then(keys => {

    keys.forEach(key => {

      if(key !== STATIC_CACHE && key.includes('static')) {
        return caches.delete(key);
      }

    });

  });

  e.waitUntil(respuesta);

});


self.addEventListener('fetch', e => {

  const respuesta = caches.match(e.request)
    .then(res => {

    if(res) {
      return res;
    } else {

      // Network fallback (dynamic cache)
      return fetch(e.request)
        .then(newRes => {

          return actualizaCacheDinamico(DYNAMIC_CACHE, e.request, newRes);

        });
    }

    


  });

  e.respondWith(respuesta);

});