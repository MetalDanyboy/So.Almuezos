# Deploy en Render Free

## Configuracion

- Runtime: Node
- Plan: Free
- Build command: `npm install`
- Start command: `npm start`
- Health check path: `/healthz`

## Pasos

1. Sube este proyecto a un repositorio de GitHub.
2. En Render, crea un **New Web Service**.
3. Conecta el repositorio.
4. Render deberia detectar `render.yaml`. Si lo configuras manualmente, usa los comandos de arriba.
5. Publica el servicio y abre la URL que Render entregue.

## Nota sobre sesiones

Las sesiones grupales viven en memoria. En Render Free pueden perderse si el servicio se reinicia, se redeploya o se duerme. La app ya expira sesiones a los 30 minutos o tras 10 minutos sin actividad.
