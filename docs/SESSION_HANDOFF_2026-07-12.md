# Entrega de sesión — 2026-07-12

## Cambios de código pendientes de guardar

- Los reportes exportados reciben los filtros activos desde el frontend y el backend.
- El listado administrativo de usuarios usa `UserRepository` mediante `AuthService`.
- El total de activos productivos de reportes se consulta mediante `ReportRepository`.
- Se agregó la pantalla web de confirmación de recuperación de contraseña y su ruta pública.

## Repositorio

- Rama: `feature/FA-001-dashboard`.
- Commit de partida: `1696283` (`docs: prepare VPS deployment handoff`).
- Los respaldos locales permanecen excluidos por `.gitignore`.

## Siguiente trabajo técnico

- Ejecutar pruebas y build después de los cambios de filtros.
- Añadir pruebas de reportes/exportación y completar la limpieza de componentes heredados.
- Preparar Docker Compose de producción cuando se disponga de VPS, dominio y parámetros reales.
