# Financial AI

## Arquitectura Oficial del Proyecto

Versión: 1.0

Estado: Activo

Última actualización: 2026-07-09

---

# Visión

Financial AI será una plataforma SaaS de Inteligencia Artificial cuyo objetivo es ayudar a las personas a construir patrimonio y alcanzar la libertad financiera.

No será un gestor de gastos.

Será un asesor financiero inteligente.

---

# Misión

Permitir que cualquier persona pueda entender, mejorar y acelerar su crecimiento financiero mediante Inteligencia Artificial.

---

# Filosofía

Toda funcionalidad debe responder a esta pregunta:

> ¿Acerca al usuario a la libertad financiera?

Si la respuesta es NO, esa funcionalidad no pertenece al MVP.

---

# Principios

## 1. Clean Architecture

Separar responsabilidades.

Nunca mezclar lógica de negocio con acceso a datos.

---

## 2. SOLID

Todo módulo debe ser reutilizable.

---

## 3. Escalabilidad

Construir pensando en miles de usuarios.

Nunca desarrollar soluciones únicamente para un usuario.

---

## 4. Código limpio

El código debe ser fácil de leer.

Debe ser más importante la claridad que escribir menos líneas.

---

## 5. Documentación

Cada módulo importante debe estar documentado.

---

# Arquitectura

```
React

↓

Services

↓

FastAPI Routers

↓

Business Services

↓

Repositories

↓

PostgreSQL
```

---

# Backend

```
backend/

app/

api/

core/

database/

models/

repositories/

routers/

schemas/

security/

services/

utils/

tests/
```

---

# Frontend

```
web/

components/

pages/

services/

hooks/

layouts/

types/

utils/

assets/
```

---

# Base de Datos

PostgreSQL

ORM:

SQLAlchemy

Migraciones:

Alembic

---

# Autenticación

JWT

bcrypt

Refresh Token

Middleware

---

# IA

OpenAI

El modelo de IA nunca accederá directamente a la base de datos.

Siempre utilizará los Services.

---

# Roadmap

## FA-001

Infraestructura

Dashboard

Docker

FastAPI

React

PostgreSQL

Alembic

---

## FA-002

Autenticación

Usuarios

JWT

Registro

Login

---

## FA-003

Dashboard API

---

## FA-004

Ingresos

---

## FA-005

Gastos

---

## FA-006

Activos

---

## FA-007

Pasivos

---

## FA-008

Metas

---

## FA-009

IA Financiera

---

## FA-010

SaaS

Suscripciones

Multiempresa

Roles

API Pública

---

# Convenciones

## Backend

- snake_case para archivos.
- PascalCase para clases.
- Tipado obligatorio.
- SQLAlchemy 2.0.

---

## Frontend

- PascalCase para componentes.
- camelCase para funciones.
- TypeScript estricto.
- Componentes pequeños y reutilizables.

---

# Flujo de Datos

```
React

↓

Services

↓

API

↓

Service Layer

↓

Repository

↓

Database
```

---

# Regla de Oro

Nunca acceder a PostgreSQL desde un Router.

Toda lógica debe pasar por Services.

---

# Calidad

Cada Sprint debe cumplir:

- Compila correctamente.
- Sin errores.
- Documentado.
- Probado.
- Código limpio.

---

# Objetivo Final

Financial AI debe convertirse en una plataforma SaaS de educación y asesoría financiera basada en Inteligencia Artificial, preparada para miles de usuarios y capaz de evolucionar sin reescribir su arquitectura.