# Database Schema

- `mortgages.next_due_date`: próxima fecha programada de cuota.

- `mortgages.remaining_months`: meses pendientes del crédito; se actualiza al registrar una cuota.

## mortgages

- `id`, `user_id`, `name`, `principal`, `annual_interest_rate`, `term_months`, `start_date`.
- Almacena la configuración de un crédito hipotecario; los importes de cuota e interés se calculan en el servicio.

PostgreSQL es configurado mediante `DATABASE_URL`. Alembic tiene seis migraciones, con cabeza `d3e4f5a6b7c8`.

| Tabla | Campos principales |
|---|---|
| `users` | id, name, email único, password hash |
| `profiles` | user_id único, country, currency, age, marital_status, children, retirement_age, financial_goal, monthly_salary |
| `incomes` | user_id, name, amount, category, frequency, is_passive, created_at |
| `expenses` | user_id, category, amount, date, description |
| `assets` | user_id, name, category, value |
| `liabilities` | user_id, name, category, balance |
| `goals` | user_id, name, target_amount, current_amount |

Todas las tablas financieras tienen clave foránea a `users.id`. No hay relaciones ORM declaradas ni auditoría/historial de patrimonio.

Migraciones: `a4cd1b6b50d4` users; `f91aea729655` profiles; `a566a9e7ca2b` incomes; `ad8ea5d6d9ee` expenses; `b1c2d3e4f5a6` assets; `c2d3e4f5a6b7` liabilities; `d3e4f5a6b7c8` goals.
