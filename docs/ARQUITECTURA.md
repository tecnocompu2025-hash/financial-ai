# Arquitectura Financial AI

Backend

FastAPI

SQLAlchemy

Alembic

PostgreSQL

JWT

---

Estructura

app/

models/

schemas/

repositories/

services/

routers/

dependencies/

database/

core/

---

Flujo

Router

↓

Service

↓

Repository

↓

Database

---

Reglas

Nunca acceder directamente a la Base de Datos desde los Routers.

Toda la lógica vive en Services.

Repositories únicamente realizan consultas.

Cada módulo debe tener:

Model

Schema

Repository

Service

Router

Migración

Pruebas Swagger

Commit Git