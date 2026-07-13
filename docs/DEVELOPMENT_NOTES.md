# Development Notes

## Variables de Docker

- Docker Compose carga las credenciales desde el archivo local `.env`, que está excluido de Git.
- Usa `.env.example` como plantilla y cambia las contraseñas antes de desplegar fuera del entorno local.

## Seguridad de respaldos

- Los respaldos de base de datos se almacenan localmente en `backups/` y se excluyen de Git para evitar publicar datos financieros o credenciales.

## Crédito hipotecario

- La fórmula de cuota usa amortización de pago fijo con tasa anual convertida a tasa mensual.
- La versión inicial no registra pagos reales ni reduce el saldo: muestra la estimación del crédito configurado.

## Arquitectura observada

El backend usa FastAPI, SQLAlchemy, Alembic, PostgreSQL y JWT. Income, Expense y Profile usan Router → Service → Repository → DB. Auth usa Service → UserRepository. Assets, Liabilities y Goals no respetan todavía ese patrón: sus routers consultan SQLAlchemy directamente.

El frontend es React 19 + Vite + Tailwind. `App.tsx` usa `BrowserRouter`, `Routes` y `Route`; el menú lateral usa `useNavigate`. Algunos managers aún conservan botones de retorno con `window.location.assign`. El JWT se guarda en `localStorage` como `financial_ai_access_token`.

## Variables de entorno requeridas por backend

`DATABASE_URL`, `SECRET_KEY`, `ALGORITHM`, `ACCESS_TOKEN_EXPIRE_MINUTES`. Se cargan desde `backend/.env`; no deben documentarse valores secretos.

## Observaciones verificadas

- CORS permite Vite/React locales en puertos 3000 y 5173.
- SQLAlchemy se configura con `echo=False` para evitar logging SQL detallado por defecto.
- El endpoint de perfil no registra en consola el identificador ni los datos financieros del usuario.
- Los montos se modelan como `Float`, no `Decimal`.
- `security.hash_password` no imprime contraseñas; el hashing y verificación fueron comprobados localmente.
- Persisten algunas páginas vacías y botones de retorno con navegación imperativa; los managers obsoletos sin importaciones activas fueron eliminados.
- Assets, Liabilities y Goals fueron verificados por una prueba de integración local que creó y eliminó registros temporales.
- Las operaciones de actualización de Assets y Liabilities fueron verificadas por integración local con registros temporales eliminados al finalizar.
- `npm run lint` no reporta errores bloqueantes, pero advierte dependencias omitidas de `useEffect` en los managers activos; requiere refactorizar la carga con `useCallback` o efectos directos.
- Las pantallas actuales permiten crear/listar/borrar para varios módulos, pero no todo el CRUD disponible en backend está expuesto en frontend.
