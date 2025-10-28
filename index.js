// Reemplaza esta variable con el URL COMPLETO de tu Deploy Hook de Pages.
const CLOUDFLARE_PAGES_DEPLOY_HOOK = 'https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/dea440e6-b126-41c7-8d19-6d420dc6942c';

async function handleRequest(request) {
  // Solo queremos procesar solicitudes POST, que son las que envía TinaCMS.
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 1. Crear una nueva solicitud limpia para el Deploy Hook.
  // 2. Usamos el método POST.
  const newRequest = new Request(CLOUDFLARE_PAGES_DEPLOY_HOOK, {
    method: 'POST',
    // NO pasamos el cuerpo (body) de TinaCMS.
    // NO pasamos encabezados (headers) de caché de TinaCMS.
    // Solo enviamos un Content-Length: 0 (implícito en un POST sin cuerpo).
  });

  try {
    // Enviar la solicitud al Deploy Hook de Pages.
    const response = await fetch(newRequest);
    
    // Cloudflare Pages responderá 200/202 si inicia la compilación.
    // Devolvemos una respuesta de éxito a TinaCMS para que no muestre un error 304.
    return new Response('Deployment triggered successfully', { status: 200 });

  } catch (error) {
    // Manejar errores de red o del hook.
    return new Response(`Error triggering deployment: ${error.message}`, { status: 500 });
  }
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
