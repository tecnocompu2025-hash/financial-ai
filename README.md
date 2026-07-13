# Financial AI

SaaS financiero personal para registrar ingresos, gastos, activos, deudas, créditos, cuotas, metas y reportes financieros.

Stack: FastAPI, SQLAlchemy, Alembic, PostgreSQL, JWT, React, Vite, TypeScript y Tailwind CSS.

## Inicio local

```powershell
docker compose up -d
cd backend
..\.venv\Scripts\uvicorn.exe main:app --reload
```

En otra terminal:

```powershell
cd web
npm run dev
```

API: `http://127.0.0.1:8000/docs`; web: `http://localhost:5173`.

Consulte `docs/PROJECT_STATUS.md`, `docs/API_ENDPOINTS.md` y `docs/NEXT_STEPS.md` para el estado auditado.
