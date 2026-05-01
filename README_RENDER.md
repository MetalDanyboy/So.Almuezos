# Deploy en Render Free

## Configuracion

- Runtime: Node
- Plan: Free
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/healthz`

## Variables de entorno

La app busca locales con Google Places API cuando `PLACES_PROVIDER=google`.
No subas claves al repositorio: `.env` y `.env.local` estan ignorados por git.

Para desarrollo local, copia `.env.example` a `.env` y completa:

- `GOOGLE_PLACES_API_KEY`: API key de Google Maps Platform con Places API habilitada.
- `PLACES_PROVIDER`: usa `google` para Google Places, `overpass` para OpenStreetMap, o `auto` para intentar Google y caer a Overpass si falla.
- `GOOGLE_PLACES_FREE_CAP`: tope gratis mensual que quieres proteger.
- `GOOGLE_PLACES_SAFETY_BUFFER`: margen de seguridad antes del tope gratis.
- `GOOGLE_PLACES_MONTHLY_LIMIT`: limite maximo de consultas que la app permitira en el mes.
- `UPSTASH_REDIS_REST_URL`: URL REST de tu base Redis en Upstash, recomendada para Render.
- `UPSTASH_REDIS_REST_TOKEN`: token REST de Upstash.

En Render, define esas mismas variables en **Environment**. No pegues la clave en ningun archivo versionado.

## Proteccion de cuota Google Places

Cada busqueda de locales consume una consulta protegida por el contador mensual de la app. Cuando llega a `GOOGLE_PLACES_MONTHLY_LIMIT`, el endpoint `/api/places` responde `429` y la interfaz bloquea la busqueda, indicando cuanto falta para el reinicio mensual.

En produccion usa Upstash Redis para que el contador sobreviva reinicios y redeploys de Render. Si `UPSTASH_REDIS_REST_URL` y `UPSTASH_REDIS_REST_TOKEN` existen, la app guarda el uso en una clave mensual como `google_places_usage:2026-05` y le asigna expiracion automatica al inicio del mes siguiente. Si Upstash esta configurado pero no responde, la app bloquea la busqueda para evitar cobros accidentales.

Si no configuras Upstash, el contador cae a `.quota/google-places-usage.json`, que sirve para desarrollo local pero no es persistente en Render Free.

## Pasos

1. Sube este proyecto a un repositorio de GitHub.
2. En Render, crea un **New Web Service**.
3. Conecta el repositorio.
4. Render deberia detectar `render.yaml`. Si lo configuras manualmente, usa los comandos de arriba.
5. Publica el servicio y abre la URL que Render entregue.

## Nota sobre sesiones

Las sesiones grupales viven en memoria. En Render Free pueden perderse si el servicio se reinicia, se redeploya o se duerme. La app ya expira sesiones a los 30 minutos o tras 10 minutos sin actividad.
