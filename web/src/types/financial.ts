export type Income = {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  category: string;
  frequency: string;
  is_passive: boolean;
  created_at: string;
};

export type Expense = {
  id: number;
  user_id: number;
  category: string;
  amount: number;
  date: string;
  description: string;
  is_essential: boolean;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  is_superuser?: boolean;
};

export type Asset = { id: number; user_id: number; name: string; category: string; value: number; classification: "productive" | "non_productive" };
export type Liability = { id: number; user_id: number; name: string; category: string; balance: number; classification: "good" | "bad"; annual_interest_rate: number };
export type Goal = { id: number; user_id: number; name: string; target_amount: number; current_amount: number };
export type DashboardSummary = { income_total: number; expense_total: number; asset_total: number; liability_total: number; cash_flow: number; net_worth: number; savings_rate: number };
export type ReportFilters = { month?: number; year?: number; category?: string; record_type?: "all" | "income" | "expense"; date_from?: string; date_to?: string };
export type ReportTransaction = { id: number; record_type: "income" | "expense"; name: string; category: string; amount: number; date: string; is_passive: boolean };
export type MonthlyReportPoint = { month: string; income: number; expense: number; balance: number };
export type FinancialReport = {
  filters: ReportFilters;
  summary: { income_total: number; expense_total: number; passive_income_total: number; cash_flow: number; asset_total: number; liability_total: number; net_worth: number; debt_ratio: number };
  categories: string[];
  transactions: ReportTransaction[];
  monthly_evolution: MonthlyReportPoint[];
  financial_health: { emergency_fund_available: number; essential_monthly_expenses: number; emergency_months: number; financial_freedom_percentage: number; productive_assets: number };
  recommendations: string[];
};
export type Mortgage = { id: number; user_id: number; name: string; credit_type: string; credit_limit: number | null; principal: number; current_balance: number; annual_interest_rate: number; term_months: number; remaining_months: number; start_date: string; next_due_date: string; monthly_payment: number; total_interest: number; next_interest: number; next_principal: number };
export type CreditPayment = { id: number; amount: number; paid_date: string; interest_amount: number; principal_amount: number };
export type AmortizationRow = { installment: number; payment: number; interest: number; principal: number; remaining_balance: number };
