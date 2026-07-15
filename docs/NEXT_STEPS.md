# Próximos pasos recomendados — 2026-07-15

La etapa actual está orientada al **Despliegue en Producción (VPS)** para disponibilidad web/móvil, dado que el MVP y las mejoras UX de ingresos, gastos y activos están estabilizadas.

## Fase 1: Despliegue en VPS (Prioridad Inmediata)

1. **Aprovisionamiento**:
   - Conexión SSH al servidor VPS (Ubuntu/Debian).
   - Instalación de Docker y Docker Compose.
   - Configuración de firewall (UFW).
2. **Entorno y Seguridad**:
   - Adquisición/configuración de nombre de dominio.
   - Creación de `.env.production` en el VPS con credenciales seguras (Postgres, JWT, SMTP).
   - Despliegue con Nginx como proxy inverso y Let's Encrypt para HTTPS.
3. **Subida a Producción**:
   - Empaquetado o pull de repositorio.
   - Ejecución de `docker-compose -f docker-compose.production.yml up -d`.
   - Verificación de migraciones y Logs.

## Fase 2: Mejoras Futuras (Post-Despliegue)
1. Añadir pruebas de integración HTTP para autenticación, permisos y CRUD financiero.
2. Añadir filtros por fecha y exportación avanzada de reportes.
3. Retirar componentes heredados del código web después de confirmar que no existan referencias externas.
4. Generar una tabla de amortización futura por crédito a partir de su saldo y cuota actuales.
5. Diseñar una migración opcional para guardar la categoría de las metas en una columna separada.
