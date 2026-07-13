# Financial AI — estado vigente

Actualizado: 2026-07-12. Este documento reemplaza las afirmaciones antiguas o con problemas de codificación de otros documentos. La fuente de verdad es el código, las migraciones y las pruebas ejecutadas.

Última verificación local: 2026-07-13 — 37 pruebas backend, 2 pruebas frontend, lint, build web y configuración de Docker Compose correctos. No existe despliegue público ni push nuevo a GitHub en esta sesión.

## Implementado

- Autenticación JWT: registro, inicio de sesión, usuario actual, cambio de contraseña y recuperación mediante token de un solo uso.
- Recuperación de contraseña: la ruta web `/reset-password?token=...` permite completar el restablecimiento desde el enlace enviado por correo.
- Las solicitudes de restablecimiento validan confirmación, longitud mínima, letras y números en frontend y backend.
- La recuperación devuelve un mensaje neutro aun cuando SMTP no está disponible, para no revelar si un correo está registrado.
- Los registros nuevos también requieren un nombre válido y una contraseña de al menos ocho caracteres con letras y números.
- Al recargar la aplicación con un token JWT vencido, la interfaz elimina la sesión local y vuelve al inicio de sesión.
- Perfil: creación, consulta y actualización autenticada mediante `PUT /profile/`.
- Las pruebas HTTP aisladas cubren autenticación, permisos administrativos, perfil, créditos/pagos, dashboard, reportes, exportaciones y aislamiento por usuario de los CRUD financieros.
- Los rangos de fechas inválidos en reportes y exportaciones responden `422` mediante una dependencia de filtros compartida.
- Crear un perfil duplicado responde `409 Conflict`; se retiraron trazas de consola que podían impedir su creación en Windows.
- CRUD autenticado de ingresos, gastos, activos, pasivos, metas y créditos.
- Pagos, historial y amortización estimada de créditos.
- Dashboard: ingresos, gastos, flujo de caja, activos, pasivos, deuda total, endeudamiento, patrimonio neto y tasa de ahorro.
- Reportes con filtros combinables por mes, año, categoría, tipo y rango de fechas; gráficas y exportación PDF/XLSX con resumen, movimientos, evolución, indicadores y recomendaciones.
- Clasificación de gastos esenciales, activos productivos/no productivos y pasivos buenos/malos.
- Frontend React/Vite para los módulos activos.
- Configuración permite crear o actualizar el perfil financiero, cambiar contraseña y cerrar sesión.
- El formulario de acceso valida datos de registro antes de la llamada a la API y muestra estados de procesamiento y errores claros.
- El perfil valida edades, edad de retiro, hijos, ingreso mensual y campos requeridos en backend.

## Verificado localmente

- Alembic tiene una única cabeza: `f1a2b3c4d5e6`.
- La última ejecución registrada de pruebas backend aprobó 11 pruebas.
- La última compilación de producción del frontend finalizó correctamente.

## Pendiente o limitado

- No existe despliegue de producción, VPS, dominio ni HTTPS configurados.
- El backend acepta `CORS_ORIGINS` y `FRONTEND_URL` desde variables de entorno para el futuro dominio.
- Se añadieron `docker-compose.production.yml`, Dockerfiles y plantilla `.env.production.example`; la ejecución real requiere una VPS y secretos no disponibles en el repositorio.
- Docker Compose de producción valida la salud de PostgreSQL y FastAPI antes de iniciar el frontend.
- El envío de recuperación requiere SMTP configurado y probado desde el proceso backend del entorno objetivo.
- El fondo de emergencia usa activos registrados como disponibilidad: el modelo no diferencia activos líquidos.
- Las metas no tienen columnas separadas para categoría ni fecha; la categoría visual se conserva en el nombre por compatibilidad.
- Existen componentes de frontend heredados excluidos de la compilación que requieren limpieza controlada.
- `FRONTEND_COMPONENTS.md` identifica las versiones activas y las heredadas excluidas para que esa limpieza sea verificable.
- La cobertura de pruebas no es todavía integral para todos los flujos visuales, pero incluye validaciones de reportes, filtros por tipo, generación de exportaciones y recuperación de contraseña en frontend.

## Módulos y rutas

`/auth`, `/profile`, `/income`, `/expense`, `/assets`, `/liabilities`, `/goals`, `/mortgages`, `/dashboard`, `/reports` y `/health` están registrados en FastAPI. Consulte `API_ENDPOINTS.md` y `/docs` del backend para las firmas vigentes.
