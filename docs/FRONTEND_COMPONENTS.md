# Componentes frontend activos

La fuente de verdad de navegación es `web/src/App.tsx`.

## Activos

- `LoginFormV2` y `ResetPasswordForm`.
- `Dashboard`.
- `IncomeManagerV7`, `ExpenseManagerV6`, `AssetManagerV6`, `LiabilityManagerV7` y `GoalManagerV3`.
- `DebtHubV2`, `AllDebts`, `CreditEditorV2`, `CustomCreditManager`, `CreditManagerV3`, `AmortizationManager` y `PaymentsHubV3`.
- `ReportManagerV3`, `SettingsManager` y `AdminUsers`.

## Heredados conservados temporalmente

`AssetManagerV5`, `CreditEditor`, `CreditManager`, `CreditManagerV2`, `DebtHub`, `ExpenseManagerV5`, `GoalManagerCategories`, `GoalManagerV2`, `IncomeManagerV5`, `LiabilityManagerV5`, `MortgageManager`, `PaymentsHub`, `PaymentsHubV2` y `ReportManager` están excluidos en `tsconfig.app.json` y no se importan desde `App.tsx`.

Se conservan hasta completar una verificación manual de cada flujo y poder retirarlos sin pérdida de funcionalidad. No forman parte del build actual.
