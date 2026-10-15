# Worker de capturas (Cloudflare Browser Rendering)

Saca la captura del sitio que analiza `/sitio` (1440x900), y mide dónde están el menú, el título, el botón y el contacto. Corre en
Cloudflare, así el servidor de Render no gasta memoria en Chromium. Plan gratuito: unos 10 minutos de navegador por día.

## Pasos (una sola vez)
1. `cd workers/captura && npm install`
2. `npx wrangler login` (abre el navegador: autorizá tu cuenta de Cloudflare)
3. `npx wrangler secret put CAPTURA_TOKEN` y pegá la clave (está en tu portapapeles y en `.env.render`). Si pregunta si crea el Worker, decí que sí.
4. `npx wrangler deploy` → imprime la dirección, algo como `https://luma-captura.TU-SUBDOMINIO.workers.dev`
5. Probar: `curl -s -X POST DIRECCION -H "Authorization: Bearer TU_CLAVE" -H "Content-Type: application/json" -d '{"url":"https://hapalandscaping.com"}' | head -c 300`
   Tiene que devolver un JSON que empieza con `{"jpeg":"/9j/...`.
6. En Render (servicio luma-landing → Environment) cargar `CAPTURA_URL` (la dirección del paso 4) y `CAPTURA_TOKEN` (la misma clave). Redeploy.

## Notas
- Sin cupo del día, el Worker responde 429 y el análisis sigue sin captura.
- Si el deploy pide activar Browser Rendering, hacelo desde el panel de Cloudflare (Workers y Pages → Browser Rendering).
- En desarrollo (tu Mac) no hace falta: sin `CAPTURA_URL` se usa tu Chrome local.
