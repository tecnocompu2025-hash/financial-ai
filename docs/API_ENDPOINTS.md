# API Endpoints

## Estado actual — 2026-07-12

Base local: `http://127.0.0.1:8000`. Las rutas protegidas requieren `Authorization: Bearer <JWT>`.

| Método | Ruta | Descripción |
|---|---|---|
| POST / GET | `/mortgages/` | Crear y listar créditos con cálculos de cuota. |
| PUT / DELETE | `/mortgages/{item_id}` | Editar o eliminar crédito. |
| POST / GET | `/mortgages/{item_id}/payments` | Registrar y listar cuotas. |
| GET | `/mortgages/{item_id}/amortization` | Tabla estimada de amortización. |
| GET | `/auth/users` | Usuarios registrados; solo superusuario. |

Assets, liabilities, goals y créditos usan Router → Service → Repository → Database.

- `GET /mortgages/{item_id}/amortization` — tabla estimada de cuotas, interés, capital y saldo restante.

## Mortgages

- `POST /mortgages/` — crea un plan de crédito hipotecario.
- `GET /mortgages/` — lista los planes y sus cálculos de cuota e interés.
- `DELETE /mortgages/{item_id}` — elimina un plan hipotecario.

Base local: `http://127.0.0.1:8000`. Las rutas protegidas requieren `Authorization: Bearer <JWT>`.

| Método | Ruta | Estado |
|---|---|---|
| GET | `/` | Información de la API |
| GET | `/health` | Health check |
| GET | `/dashboard/summary` | Resumen financiero autenticado: totales, flujo de caja, patrimonio neto y tasa de ahorro |
| GET | `/auth/status` | Estado de autenticación |
| POST | `/auth/register` | Registro |
| POST | `/auth/login` | Login y JWT |
| GET | `/auth/me` | Usuario actual |
| POST, GET | `/profile/` | Crear y consultar perfil; devuelve `ProfileResponse` |
| POST, GET | `/income/` | Crear y listar ingresos; devuelve `IncomeResponse` |
| GET, PUT, DELETE | `/income/{income_id}` | Consultar, actualizar y borrar ingreso; GET/PUT devuelven `IncomeResponse` |
| POST, GET | `/expense/` | Crear y listar gastos |
| GET, PUT, DELETE | `/expense/{expense_id}` | Consultar, actualizar y borrar gasto |
| POST, GET | `/assets/` | Crear y listar activos |
| PUT, DELETE | `/assets/{asset_id}` | Actualizar y borrar activo |
| POST, GET | `/liabilities/` | Crear y listar deudas |
| PUT, DELETE | `/liabilities/{item_id}` | Actualizar y borrar deuda |
| POST, GET | `/goals/` | Crear y listar metas |
| PUT, DELETE | `/goals/{item_id}` | Actualizar y borrar meta |

Assets, liabilities y goals usan acceso directo a SQLAlchemy en sus routers; no tienen repositorio ni service layer.
