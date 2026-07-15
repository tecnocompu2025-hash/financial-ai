# Financial AI

## Release status - 2026-07-15

- Mejoras de UI en el módulo de Ingresos (IncomeManagerV7):
  - Integración de campo `created_at` para permitir registros históricos.
  - Implementación de lista dinámica de bancos según el país del perfil (auto-completado con `<datalist>`) extraídos del historial de registros.
- Mejoras de UI en el módulo de Patrimonio/Activos (AssetManagerV6):
  - Separación visual inteligente de Cuentas/Liquidez vs Inversiones/Propiedades.
  - Fix de actualización de estado y visualización de mensajes de error en creación de activos.
- Deployment pending: configure VPS, domain, HTTPS, production CORS, SMTP credentials and production environment variables.

## Release status - 2026-07-14

## ImplementaciÃ³n en curso â€” AnalÃ­tica financiera

- Se agregÃ³ `GET /reports/financial` con filtros combinables por mes, aÃ±o, categorÃ­a, tipo y rango de fechas.
- La pantalla Reportes consume esa fuente Ãºnica para totales, tabla de movimientos, evoluciÃ³n mensual y grÃ¡ficos Recharts.
- Se prepararon migraciones para clasificar activos, deudas y gastos esenciales.
- Los indicadores de fondo de emergencia, libertad financiera y recomendaciones usan los datos filtrados disponibles.
- Pendientes de este alcance: exportaciÃ³n, recuperaciÃ³n de contraseÃ±a, pruebas ampliadas y validaciÃ³n de migraciones en PostgreSQL.

## Cierre técnico — 2026-07-12

- Formularios visuales activos para ingresos, gastos, activos, deudas, metas, créditos y cuotas.
- Créditos incluyen saldo, interés, plazo, fechas, pagos, historial y amortización.
- Reportes incluyen flujo de caja, deuda total, endeudamiento, patrimonio y detalle de créditos.
- Docker usa variables locales de entorno y los respaldos se excluyen de Git.
- Quedan componentes heredados sin ruta activa que pueden retirarse en una limpieza posterior.

## Actualización 2026-07-12 — Reportes de créditos

- El reporte financiero incluye saldos y próximas cuotas de los créditos registrados.

## Actualización 2026-07-12 — Plazo restante

- Cada cuota disminuye el saldo y los meses restantes del crédito.

## Actualización 2026-07-12 — Amortización

- El módulo de créditos incluye una tabla estimada de amortización basada en el saldo actual.

## Actualización 2026-07-12 — Cuotas de créditos

- Deudas incluye créditos hipotecarios, vehiculares, personales, empresariales y tarjetas.
- La pantalla Cuotas registra pagos e informa el historial de interés y capital.

## Actualización 2026-07-12 — Crédito hipotecario

- Nuevo módulo de planificación hipotecaria: capital, tasa anual, plazo en meses y fecha de inicio.
- Calcula cuota mensual, interés total estimado y la composición de la primera cuota.

## ActualizaciÃ³n 2026-07-12 — Metas y dashboard

- El dashboard web consume `GET /dashboard/summary` para mostrar totales calculados por el backend.
- Metas incluye una lista de categorÃ­as financieras y permite registrar una categorÃ­a personalizada.
- Por compatibilidad con el esquema actual, la categorÃ­a se conserva dentro del nombre de la meta; no existe aÃºn una columna de categorÃ­a independiente.

## Estado auditado — 2026-07-12

Backend: FastAPI con routers de auth, health, profile, income, expense, asset, liability y goal. Las migraciones llegan a goals. Auth, Profile, Income y Expense usan parte de Repository/Service Layer; Assets, Liabilities y Goals consultan SQLAlchemy directamente desde routers.

Frontend: React/Vite con login, registro, dashboard, ingresos, gastos, activos, deudas, metas, reportes y configuración. Usa `window.location`, no React Router. Hay componentes antiguos/duplicados sin uso.

Implementado: JWT, perfiles, CRUD API de ingresos/gastos, creación/listado/eliminación de activos/deudas/metas, dashboard/reportes calculados en cliente.

Metas: la interfaz permite crear, eliminar y actualizar el monto alcanzado.
Ingresos: la interfaz permite crear, eliminar y editar el monto.
Gastos: la interfaz permite crear, eliminar y editar el monto.
Gastos: la creación web permite seleccionar la fecha del movimiento.
Activos: la interfaz permite crear, eliminar y editar el valor.
Deudas: la interfaz permite crear, eliminar y editar el saldo.

Pendiente: consolidar arquitectura, CRUD de edición UI, series históricas, pruebas y seguridad.

Dashboard backend: `GET /dashboard/summary` centraliza totales, flujo de caja, patrimonio neto y tasa de ahorro para el usuario autenticado.

Actualización: Assets, Liabilities y Goals cumplen Repository Pattern y Service Layer.

# Estado del Proyecto

Fecha: 10/07/2026

---

# Sprint Actual

FA-004 - Expense Module

---

# Estado General

## Backend

✅ FastAPI

✅ PostgreSQL

✅ SQLAlchemy

✅ Alembic

✅ JWT Authentication

✅ Bearer Authentication

---

# Módulos Completados

## Authentication

✅ Registro

✅ Login

✅ Endpoint /auth/me

✅ JWT

✅ Protección de rutas

---

## Profile

✅ Crear Perfil

---

## Income (CRUD Completo)

✅ POST /income/

✅ GET /income/

✅ GET /income/{id}

✅ PUT /income/{id}

✅ DELETE /income/{id}

---

## Expense (CRUD Completo)

✅ POST /expense/

✅ GET /expense/

✅ GET /expense/{id}

✅ PUT /expense/{id}

✅ DELETE /expense/{id}

✅ Validación de datos y prueba integral contra la API local

---

# Base de Datos

Tablas creadas

✅ users

✅ profiles

✅ incomes

✅ expenses

---

# Arquitectura

Repository Pattern

Service Layer

Routers

Schemas

Models

---

# Frontend

✅ React

✅ TypeScript

✅ Tailwind CSS

⬜ Dashboard

⬜ Sidebar Profesional

⬜ Integración API

---

# Git

Primer Commit Estable

Commit:

5ba963b

Mensaje:

v0.1 - Authentication, Profile and Income completed

---

# Próximo Sprint

FA-005

Dashboard Financiero

---

# Objetivo

Completar el Dashboard Financiero con ingresos y gastos reales.
Continuemos con Financial AI.

Estado:
- Último commit: 5ba963b
- Authentication ✅
- Profile ✅
- Income CRUD ✅
- Expense CRUD ✅
- Próximo Sprint: FA-005 Dashboard Financiero

Quiero continuar exactamente desde aquí.
