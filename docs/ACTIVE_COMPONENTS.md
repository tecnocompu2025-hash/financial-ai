# Componentes activos

## Rutas financieras activas

- `IncomeManagerV5`
- `ExpenseManagerV5`
- `AssetManagerV5`
- `LiabilityManagerV5`
- `GoalManagerCategories`
- `CustomCreditManager`
- `CreditEditorV2`
- `CreditManagerV2`
- `PaymentsHubV3`
- `AmortizationManager`
- `ReportManagerV2`

## Componentes heredados pendientes de retiro

Estos componentes no están importados por las rutas actuales y no deben recibir cambios funcionales nuevos:

- `CreditManager`
- `MortgageManager`
- `PaymentsHub`
- `PaymentsHubV2`
- `DebtHub`
- `GoalManagerV2`
- `ReportManager`

Antes de eliminarlos físicamente, se debe mantener una copia versionada o confirmar que no se usan en documentación externa.

Estos archivos están excluidos de las verificaciones del proyecto activo durante la transición; las rutas usan las versiones actuales.
