# Financial AI — estado vigente

Actualizado: 2026-07-12. Este documento reemplaza las afirmaciones antiguas o con problemas de codificación de otros documentos. La fuente de verdad es el código, las migraciones y las pruebas ejecutadas.

## Implementado

- Autenticación JWT: registro, inicio de sesión, usuario actual, cambio de contraseña y recuperación mediante token de un solo uso.
- Recuperación de contraseña: la ruta web `/reset-password?token=...` permite completar el restablecimiento desde el enlace enviado por correo.
- Las solicitudes de restablecimiento validan confirmación, longitud mínima, letras y números en frontend y backend.
- Perfil: creación y consulta.
- CRUD autenticado de ingresos, gastos, activos, pasivos, metas y créditos.
- Pagos, historial y amortización estimada de créditos.
- Dashboard: ingresos, gastos, flujo de caja, activos, pasivos, patrimonio neto y tasa de ahorro.
- Reportes con filtros combinables por mes, año, categoría, tipo y rango de fechas; gráficas y exportación PDF/XLSX.
- Clasificación de gastos esenciales, activos productivos/no productivos y pasivos buenos/malos.
- Frontend React/Vite para los módulos activos.

## Verificado localmente

- Alembic tiene una única cabeza: `f1a2b3c4d5e6`.
- La última ejecución registrada de pruebas backend aprobó 11 pruebas.
- La última compilación de producción del frontend finalizó correctamente.

## Pendiente o limitado

- No existe despliegue de producción, VPS, dominio ni HTTPS configurados.
- El envío de recuperación requiere SMTP configurado y probado desde el proceso backend del entorno objetivo.
- El fondo de emergencia usa activos registrados como disponibilidad: el modelo no diferencia activos líquidos.
- Las metas no tienen columnas separadas para categoría ni fecha; la categoría visual se conserva en el nombre por compatibilidad.
- Existen componentes de frontend heredados excluidos de la compilación que requieren limpieza controlada.
- La cobertura de pruebas no es todavía integral para todos los flujos visuales y de exportación.

## Módulos y rutas

`/auth`, `/profile`, `/income`, `/expense`, `/assets`, `/liabilities`, `/goals`, `/mortgages`, `/dashboard`, `/reports` y `/health` están registrados en FastAPI. Consulte `API_ENDPOINTS.md` y `/docs` del backend para las firmas vigentes.
