# Entrega de sesión — 2026-07-12

## Cambios de código pendientes de guardar

- Los reportes exportados reciben los filtros activos desde el frontend y el backend.
- El listado administrativo de usuarios usa `UserRepository` mediante `AuthService`.
- El total de activos productivos de reportes se consulta mediante `ReportRepository`.
- Se agregó la pantalla web de confirmación de recuperación de contraseña y su ruta pública.
- Se añadió una prueba de esquema para contraseñas de restablecimiento débiles o no coincidentes.
- La exportación incorpora hojas de evolución, indicadores y recomendaciones; se validan formatos PDF/XLSX en pruebas backend.
- Se corrigió el límite final de fecha de ingresos y se añadieron pruebas de cálculos y filtro por tipo de los reportes.
- El perfil dispone de actualización autenticada mediante `PUT /profile/`, con pruebas de servicio.
- Se añadieron validaciones y pruebas de esquema para los campos financieros del perfil.
- El registro de usuarios valida nombre y contraseña segura; se añadieron pruebas de esquema.
- Se configuró Vitest para frontend y se añadieron pruebas del formulario de recuperación de contraseña.
- La recuperación de contraseña usa respuesta neutra ante falta o fallo de SMTP y fechas UTC compatibles con el esquema actual.
- El dashboard centraliza deuda total y porcentaje de endeudamiento en el backend, con prueba de cálculo.

## Repositorio

- Rama: `feature/FA-001-dashboard`.
- Commit de partida: `1696283` (`docs: prepare VPS deployment handoff`).
- Los respaldos locales permanecen excluidos por `.gitignore`.

## Siguiente trabajo técnico

- Ejecutar pruebas y build después de los cambios de filtros.
- Añadir pruebas de reportes/exportación y completar la limpieza de componentes heredados.
- Preparar Docker Compose de producción cuando se disponga de VPS, dominio y parámetros reales.
