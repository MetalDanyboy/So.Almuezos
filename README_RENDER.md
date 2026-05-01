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

En Render, define esas mismas variables en **Environment**. No pegues la clave en ningun archivo versionado.

## Proteccion de cuota Google Places

Cada busqueda de locales consume una consulta protegida por el contador local de la app. Cuando llega a `GOOGLE_PLACES_MONTHLY_LIMIT`, el endpoint `/api/places` responde `429` y la interfaz bloquea la busqueda, indicando cuanto falta para el reinicio mensual. El contador vive por defecto en `.quota/google-places-usage.json`, archivo ignorado por git.

## Pasos

1. Sube este proyecto a un repositorio de GitHub.
2. En Render, crea un **New Web Service**.
3. Conecta el repositorio.
4. Render deberia detectar `render.yaml`. Si lo configuras manualmente, usa los comandos de arriba.
5. Publica el servicio y abre la URL que Render entregue.

## Nota sobre sesiones

Las sesiones grupales viven en memoria. En Render Free pueden perderse si el servicio se reinicia, se redeploya o se duerme. La app ya expira sesiones a los 30 minutos o tras 10 minutos sin actividad.
