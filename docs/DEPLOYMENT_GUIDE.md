# Guía de despliegue pendiente

Financial AI está preparado para una futura VPS Linux, pero no está desplegado.

1. Prepare una VPS con Ubuntu 24.04 LTS, un dominio y acceso SSH.
2. Cree secretos de producción: base PostgreSQL, `SECRET_KEY`, configuración SMTP y origen CORS. No reutilice ni suba el `.env` local.
3. Instale Docker, Docker Compose, Nginx y Certbot en el servidor.
4. Clone el repositorio y ejecute `alembic upgrade head` contra PostgreSQL de producción.
5. Compile el frontend configurando la URL pública correcta de la API.
6. Configure Nginx y HTTPS con Let's Encrypt.
7. Compruebe `/health`, registro, inicio de sesión, reportes, exportación y recuperación de contraseña desde el dominio real.

No se deben declarar los servicios como desplegados hasta verificar el servidor, dominio, HTTPS y SMTP.
