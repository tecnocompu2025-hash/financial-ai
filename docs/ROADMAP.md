# Financial AI Roadmap

## Next release - VPS deployment

1. Provision a VPS with Ubuntu and SSH access.
2. Configure Docker/Nginx or system services for FastAPI, PostgreSQL and the React build.
3. Configure domain DNS, HTTPS, production `VITE_API_URL`, CORS and Gmail SMTP.
4. Add HTTP integration and frontend component tests before public launch.

## Cierre de mejora técnica — 2026-07-12

- Completados formularios visuales prioritarios, pruebas unitarias iniciales, configuración de Docker por entorno y reportes detallados.
- Siguiente etapa recomendada: pruebas de integración, filtros por fecha y despliegue seguro.

- Créditos: cálculo, pagos, historial y tabla de amortización estimada implementados.

- Créditos: historial de cuotas implementado. Pendiente: tabla completa de amortización futura.

- Planificador de crédito hipotecario: implementado como módulo inicial; falta registrar pagos y generar la tabla completa de amortización.

## ActualizaciÃ³n 2026-07-12

- Dashboard: resumen de totales integrado entre frontend y backend.
- Metas: categorÃ­as de interfaz completadas; una categorÃ­a persistida separadamente requerirÃ­a una migraciÃ³n futura.

## Estado auditado — 2026-07-12

Implementado en código: Auth, Profile, Income, Expense, Assets, Liabilities, Goals, Dashboard, Reportes, Configuración y recomendaciones simples.

Pendiente: consolidar navegación/CRUD UI, Net Worth histórico, Cash Flow temporal, Emergency Fund, Savings Rate formal, Financial Freedom definido, AI Advisor avanzado, pruebas, despliegue y SaaS.

# Fase 1 (Backend)

## Authentication

✅ Registro

✅ Login

✅ JWT

✅ Perfil Financiero

---

## Income

✅ CRUD Completo

---

## Expense

✅ CRUD Completo

---

## Assets

✅ CRUD

---

## Liabilities

✅ CRUD

---

## Net Worth

✅ Cálculo Automático

---

# Fase 2

Dashboard Profesional ✅

✅ Reportes financieros

✅ Metas financieras

✅ Configuración de cuenta

Cash Flow

Emergency Fund

Savings Rate

Financial Score

Financial Freedom %

---

# Fase 3

Motor IA

Análisis Financiero

Detección de malos hábitos

Predicción de gastos

Proyección patrimonial

Plan de inversión

Plan de jubilación

---

# Fase 4

React Dashboard

Gráficos

Reportes

Configuración

Modo Oscuro

Responsive

---

# Fase 5

SaaS

Stripe

Planes

Usuarios

Empresas

API Pública

Aplicación móvil
