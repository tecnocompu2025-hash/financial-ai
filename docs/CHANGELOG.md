# CHANGELOG

## 2026-07-15 - Módulo de Cuentas por Pagar
- **Cuentas por Pagar:** Se implementó un nuevo módulo dedicado para el registro y seguimiento de cuentas pendientes de pago.
- **Control de Flujo de Caja:** Los gastos no pagados (marcados como pendientes) ya no descuentan del flujo de caja del Dashboard ni suman al total de reportes hasta que se confirmen como pagados.
- **Mejoras en el Registro de Gastos:** Se agregó un checkbox "Pagado" y un identificador visual "Pagado" (en verde) para reconocer ágilmente las cuentas saldadas en la tabla principal.
- **Acciones de Cuentas Pendientes:** Los gastos pendientes pueden ser pagados (con confirmación inmediata) o eliminados desde la vista exclusiva.
## 2026-07-14 - Categorías y Multi-moneda
- **Categorías Inteligentes:** Se reemplazaron los campos de texto de categorías por `<datalist>` en Gastos e Ingresos, ofreciendo categorías predefinidas y soporte total para categorías personalizadas.
- **Soporte Multi-moneda:** Se implementó `CurrencyContext` global que permite definir la moneda base del usuario.
- **Toggle USD:** Se agregó un botón en el Header que consulta el tipo de cambio en vivo desde una API pública y convierte instantáneamente todos los valores del Dashboard a Dólares (USD).
- **Refactorización de UI:** Se erradicó el símbolo "S/" (Soles) escrito en duro de 16 componentes, usando `Intl.NumberFormat` dinámico con soporte de compactación.

## 2026-07-14 - Dashboard MVP Finalizado

- Se rediseñó por completo el Dashboard profesional con estilo Premium (modo oscuro, "glassmorphism", gradientes).
- Se implementaron tarjetas animadas de Net Worth, Flujo de Caja, Activos, Deudas e Ingresos/Gastos.
- Se refactorizó la visualización del Patrimonio Neto (`WealthChart`) usando `recharts` con gradientes.
- Se implementó un AI Advisor estilo chat.
- El Financial Score ahora cuenta con un círculo de progreso radial dinámico e interactivo.
- Se eliminaron todos los componentes frontend "Legacy" o V1/V5/V6 heredados que ya no estaban en uso (`AssetManagerV5`, etc.).
- El Build de producción de frontend pasa sin errores.
## 2026-07-13 - Release preparation

- Created local source and PostgreSQL backups before Git synchronization.
- Documented VPS deployment requirements and current release status.

## 2026-07-12 â€” Reportes e indicadores financieros

- Nuevo endpoint de reporte filtrable y visualizaciones interactivas.
- ClasificaciÃ³n de activos/deudas y marcado de gastos esenciales preparados mediante migraciones.
- Agregadas recomendaciones financieras basadas en reglas y datos del usuario.

## 2026-07-12 — Documentación técnica

- Actualizados README y endpoints de créditos, pagos, superusuario y arquitectura Repository/Service.

## 2026-07-12 — Permisos centralizados

- Validación de token reforzada y permiso de superusuario centralizado en una dependencia reutilizable.

## 2026-07-12 — Aislamiento de código heredado

- Archivos heredados sin rutas activas se aislaron de TypeScript y lint durante la transición.

## 2026-07-12 — Protección de crédito pagado

- Agregada prueba para impedir pagos adicionales sobre un crédito con saldo cero.

## 2026-07-12 — Validación de ingresos

- Ingresos ahora valida longitud de textos y monto positivo en el backend.

## 2026-07-12 — Navegación financiera

- Menú reorganizado por resumen, flujo de caja, construcción de riqueza y deudas/créditos.

## 2026-07-12 — Indicadores de reporte

- Reportes incorpora flujo de caja, deuda total, endeudamiento y patrimonio neto.

## 2026-07-12 — Inventario de componentes

- Documentados componentes activos y heredados para completar una limpieza segura.

## 2026-07-12 — Configuración segura de Docker

- Las credenciales de Docker se movieron a `.env` local y se añadió `.env.example`.
- Eliminada la versión obsoleta de Docker Compose.

## 2026-07-12 — Prueba de cuota completa

- Agregada prueba para confirmar que una cuota completa actualiza plazo y próxima fecha.

## 2026-07-12 — Prueba de pagos parciales

- Agregada prueba para garantizar que un pago parcial no avance la cuota siguiente.

## 2026-07-12 — Pruebas de autenticación

- Agregadas pruebas para registro con contraseña cifrada y rechazo de correos duplicados.

## 2026-07-12 — Estabilidad de edición de créditos

- Corregida la carga de créditos en la pantalla de edición para respetar dependencias de React.

## 2026-07-12 — Pruebas de seguridad

- Agregada prueba de cifrado y verificación de contraseñas.

## 2026-07-12 — Pruebas de crédito

- Agregadas pruebas unitarias iniciales para cuota sin interés y amortización.

## 2026-07-12 — Protección de respaldos

- La carpeta local de respaldos se excluyó de Git.

## 2026-07-12 — Inicio de superusuario

- El superusuario inicia en la lista de usuarios registrados en lugar del dashboard.

## 2026-07-12 — Superusuario

- Añadido rol de superusuario y endpoint protegido para consultar usuarios registrados.

## 2026-07-12 — Pagos agrupados

- Pagos clasifica créditos por tipo y muestra las deudas generales en su propia sección.

## 2026-07-12 — Todas las deudas

- Deudas incorpora una vista unificada de deudas generales y créditos con accesos a historial y pagos.

## 2026-07-12 — Pagos pendientes

- Pagos ahora lista todos los créditos pendientes ordenados por fecha de cuota, con saldo y cuota estimada.

## 2026-07-12 — Registro libre de tipos de crédito

- El formulario de créditos permite escribir cualquier tipo y ofrece sugerencias sin restringir al usuario.

## 2026-07-12 — Tipos de crédito personalizados

- El backend acepta cualquier tipo de crédito escrito por el usuario, sin limitarlo a una lista fija.

## 2026-07-12 — Créditos editables y sin interés

- Agregados préstamos familiares y compras sin intereses; se acepta interés anual 0.
- Agregado endpoint y pantalla para editar créditos.

## 2026-07-12 — Reporte de créditos

- Reportes ahora muestra total de créditos y el detalle de saldo, cuota, próxima fecha y plazo pendiente.

## 2026-07-12 — Próxima fecha de cuota

- Los créditos guardan y muestran su próxima fecha de pago; al registrar una cuota avanza un mes.

## 2026-07-12 — Registro desde Deudas

- Deudas ahora presenta la opción de registrar una deuda general o un crédito con interés, plazo y fecha de primera cuota.

## 2026-07-12 — Menú Pagos

- Créditos, Cuotas y Amortización se agruparon bajo un único acceso llamado Pagos.

## 2026-07-12 — Meses restantes de crédito

- Los créditos ahora guardan meses restantes y los reducen al registrar una cuota.
- La proyección de amortización usa el saldo y plazo restantes.

## 2026-07-12 — Amortización

- Agregada tabla de amortización estimada por crédito con cuota, interés, capital y saldo restante.

## 2026-07-12 — Historial de cuotas

- Agregada la pantalla de historial de pagos de créditos y tarjetas.
- Cada registro muestra fecha, monto pagado, interés y abono a capital.

## 2026-07-12 — Créditos, cuotas y tarjetas

- Créditos hipotecarios, vehiculares, personales, empresariales y tarjeteros usan un mismo módulo de deudas.
- Las cuotas registradas separan interés y capital, actualizan el saldo y por tanto el total de deudas.
- Las tarjetas incluyen límite de crédito, saldo usado, crédito disponible e interés anual.

## 2026-07-12 — Mortgage planner

- Agregado el módulo de créditos hipotecarios con capital, tasa anual, plazo en meses y fecha de inicio.
- La API calcula cuota mensual, interés total y la distribución de capital/interés de la primera cuota.

## 2026-07-12 — Goal categories

- El formulario de Metas ahora ofrece categorías financieras predefinidas y una opción de categoría personalizada.
- La categoría se guarda como parte del nombre de la meta; no se modificó el esquema existente de la base de datos.

## 2026-07-12 — Auditoría de documentación

- Documentado el estado real de backend, frontend, migraciones, endpoints y base de datos.
- Registrados Assets, Liabilities y Goals como módulos existentes.
- Documentadas limitaciones: arquitectura desigual, navegación sin router, componentes duplicados y falta de pruebas automatizadas.

## 2026-07-12 — Assets architecture

- Assets fue migrado de acceso directo en router a Router → Service → Repository → Database.
- Endpoints y esquema de respuesta se preservaron.

## 2026-07-12 — Liabilities architecture

- Liabilities fue migrado a Router → Service → Repository → Database.
- Endpoints y respuestas existentes se preservaron.

## 2026-07-12 — Goals architecture

- Goals fue migrado a Router → Service → Repository → Database.
- Se preservaron crear, listar, actualizar y eliminar metas.

## 2026-07-12 — API response contracts

- Income ahora declara respuestas Pydantic y código 201 en creación.
- Profile declara respuestas Pydantic para creación y consulta.

## 2026-07-12 — Security

- Eliminado el registro de contraseñas y metadatos sensibles durante el hashing.

## 2026-07-12 — Frontend navigation

- Aplicado `BrowserRouter`, `Routes` y `Route` a la aplicación.
- El menú lateral ahora usa `useNavigate` en lugar de recargar con `window.location.assign`.
- Compilación de frontend verificada correctamente.

## 2026-07-12 — Integration verification

- Verificado contra la API local el ciclo crear/eliminar de Assets, Liabilities y Goals tras su refactorización.

## 2026-07-12 — Frontend cleanup

- Eliminados 13 componentes frontend obsoletos sin importaciones activas, incluidos managers V1/V2 y tarjetas sin uso.
- Compilación frontend aprobada después de la limpieza.

## 2026-07-12 — Goal progress UI

- Agregado control web para actualizar el monto alcanzado de una meta mediante el endpoint existente `PUT /goals/{item_id}`.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Income editing UI

- Agregado control web para editar el monto de un ingreso mediante `PUT /income/{income_id}`.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Expense editing UI

- Agregado control web para editar el monto de un gasto mediante `PUT /expense/{expense_id}`.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Asset editing UI

- Agregado `PUT /assets/{asset_id}` mediante Repository y Service Layer.
- Agregado control web para editar el valor de un activo.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Liability editing UI

- Agregado `PUT /liabilities/{item_id}` mediante Repository y Service Layer.
- Agregado control web para editar el saldo de una deuda.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Update endpoint verification

- Verificados contra la API local los ciclos crear, actualizar y eliminar de Assets y Liabilities.

## 2026-07-12 — Database logging

- Desactivado `echo=True` de SQLAlchemy para no registrar todas las consultas por defecto.

## 2026-07-12 — Profile cleanup

- Eliminado el registro de identificador y datos de perfil desde el router.
- Actualizado ProfileRepository para usar `model_dump()` de Pydantic.

## 2026-07-12 — Expense date UI

- El formulario web de gastos permite seleccionar la fecha del movimiento.
- La lista de gastos muestra la fecha registrada.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Expense full editing

- La edición web de gastos permite modificar categoría, monto y fecha.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Asset full editing

- La edición web de activos permite modificar categoría y valor.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Liability full editing

- La edición web de deudas permite modificar categoría y saldo.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Income full editing

- La edición web de ingresos permite modificar categoría y monto.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Manager cleanup

- Eliminados 10 managers V3/V4 obsoletos sin importaciones activas.
- Conservados los managers activos con edición completa.
- Compilación frontend verificada correctamente.

## 2026-07-12 — Dashboard summary API

- Agregado `GET /dashboard/summary` con Router → Service → Repository.
- El resumen calcula totales, flujo de caja, patrimonio neto y tasa de ahorro por usuario.
- Servicio verificado contra la base de datos local.

## 2026-07-05

✔ React instalado

✔ FastAPI conectado

✔ Tailwind configurado

✔ Landing creada
# 2026-07-06

## FA-001

- Se configuró React + Vite.
- Se configuró Tailwind.
- Se organizó la estructura del proyecto.
- Se creó Layout.
- Se creó Header.
- Se creó Sidebar.
- Se conectó Dashboard.
- Se validó el funcionamiento del Layout.
