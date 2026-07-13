# Guía de despliegue pendiente

Financial AI está preparado para una futura VPS Linux, pero no está desplegado.

1. Prepare una VPS con Ubuntu 24.04 LTS, un dominio y acceso SSH.
2. Copie `.env.production.example` como `.env.production` y reemplace todos los marcadores con secretos reales: base PostgreSQL, `SECRET_KEY`, SMTP, `FRONTEND_URL` y `CORS_ORIGINS`. No reutilice ni suba el `.env` local.
3. Instale Docker y Docker Compose en el servidor.
4. Clone el repositorio y ejecute `docker compose --env-file .env.production -f docker-compose.production.yml up -d --build`. El servicio API ejecuta `alembic upgrade head` antes de iniciar.
5. Configure el proxy público y HTTPS con Nginx/Let's Encrypt en la VPS, o adapte el puerto 80 del servicio web a su proxy existente.
6. Compruebe `/api/health`, registro, inicio de sesión, reportes, exportación y recuperación de contraseña desde el dominio real.

`docker-compose.production.yml` incluye PostgreSQL persistente, API FastAPI y frontend Nginx. El frontend usa `/api` internamente, por lo que no necesita exponer el puerto del API al público.

No se deben declarar los servicios como desplegados hasta verificar el servidor, dominio, HTTPS y SMTP.
