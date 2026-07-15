# Próxima sesión

## Objetivo

Desplegar el proyecto en un VPS (Servidor Virtual Privado) de Producción.

## Orden

1. Configurar y adquirir un VPS (DigitalOcean, AWS, etc.).
2. Configurar dominios y DNS (A records).
3. Clonar repositorio en el VPS.
4. Generar contraseñas seguras para `.env.production` (Base de datos, SMTP, API_URL).
5. Desplegar contenedores con `docker-compose.production.yml`.
6. Configurar Nginx para servir el frontend y reverso a FastAPI.
7. Configurar certificados SSL (HTTPS) con Let's Encrypt.
8. Probar flujo completo en producción (Registro, Login, Recuperación de clave).