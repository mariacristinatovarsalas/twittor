// Archivo auxiliar de SW

// Guardar en el caché dinámico
function actualizaCacheDinamico(dynamicCache, req, res) {

  if(res.ok) {

    // Pongo este primer return porque el caches.open retorna una promesa
    return caches.open(dynamicCache)
      .then(cache => {

        cache.put(req, res.clone());
        return res.clone();

      });
  } else {
    // Falló el cache y falló la red
    return res;
  }

}