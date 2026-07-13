import { apiRequest } from "./api";
import type { AmortizationRow, Asset, CreditPayment, DashboardSummary, Expense, FinancialReport, Goal, Income, Liability, LoginResponse, Mortgage, ReportFilters, User } from "../types/financial";

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", undefined, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
}

export function register(name: string, email: string, password: string) {
  return apiRequest<{ message: string }>("/auth/register", undefined, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
}
export const requestPasswordReset = (email: string) => apiRequest<{ message: string }>("/auth/password-reset/request", undefined, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
export const confirmPasswordReset = (token: string, new_password: string, confirm_password: string) => apiRequest<{ message: string }>("/auth/password-reset/confirm", undefined, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, new_password, confirm_password }) });

export const getIncomes = (token: string) => apiRequest<Income[]>("/income/", token);
export const getExpenses = (token: string) => apiRequest<Expense[]>("/expense/", token);
export const getCurrentUser = (token: string) => apiRequest<User>("/auth/me", token);
export const getRegisteredUsers = (token: string) => apiRequest<User[]>("/auth/users", token);
export const changePassword = (token: string, current_password: string, new_password: string, confirm_password: string) => apiRequest<{ message: string }>("/auth/change-password", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current_password, new_password, confirm_password }) });
export const getDashboardSummary = (token: string) => apiRequest<DashboardSummary>("/dashboard/summary", token);
export function getFinancialReport(token: string, filters: ReportFilters) {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  const suffix = params.size ? `?${params.toString()}` : "";
  return apiRequest<FinancialReport>(`/reports/financial${suffix}`, token);
}
export async function downloadFinancialReport(token: string, format: "pdf" | "xlsx", filters: ReportFilters = {}) {
  const baseUrl = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => { if (value !== undefined && value !== "") params.set(key, String(value)); });
  const suffix = params.size ? `?${params.toString()}` : "";
  const response = await fetch(`${baseUrl}/reports/export/${format}${suffix}`, { headers: { Authorization: `Bearer ${token}` } });
  if (!response.ok) throw new Error("No se pudo exportar el reporte.");
  const url = URL.createObjectURL(await response.blob()); const link = document.createElement("a");
  link.href = url; link.download = `reporte-financial-ai.${format}`; link.click(); URL.revokeObjectURL(url);
}

export type IncomePayload = Omit<Income, "id" | "user_id" | "created_at">;

export const createIncome = (token: string, data: IncomePayload) => apiRequest<Income>("/income/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const updateIncome = (token: string, id: number, data: IncomePayload) => apiRequest<Income>(`/income/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteIncome = (token: string, id: number) => apiRequest<{ message: string }>(`/income/${id}`, token, { method: "DELETE" });

export type ExpensePayload = Omit<Expense, "id" | "user_id">;
export const createExpense = (token: string, data: ExpensePayload) => apiRequest<Expense>("/expense/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const updateExpense = (token: string, id: number, data: ExpensePayload) => apiRequest<Expense>(`/expense/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteExpense = (token: string, id: number) => window.confirm("¿Eliminar este gasto?") ? apiRequest<{ message: string }>(`/expense/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const getAssets = (token: string) => apiRequest<Asset[]>("/assets/", token);
export type AssetPayload = Omit<Asset, "id" | "user_id" | "classification"> & { classification?: Asset["classification"] };
export const createAsset = (token: string, data: AssetPayload) => apiRequest<Asset>("/assets/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const updateAsset = (token: string, id: number, data: AssetPayload) => apiRequest<Asset>(`/assets/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteAsset = (token: string, id: number) => window.confirm("¿Eliminar este activo?") ? apiRequest<{ message: string }>(`/assets/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const getLiabilities = (token: string) => apiRequest<Liability[]>("/liabilities/", token);
export type LiabilityPayload = Omit<Liability, "id" | "user_id" | "classification" | "annual_interest_rate"> & { classification?: Liability["classification"]; annual_interest_rate?: number };
export const createLiability = (token: string, data: LiabilityPayload) => apiRequest<Liability>("/liabilities/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const updateLiability = (token: string, id: number, data: LiabilityPayload) => apiRequest<Liability>(`/liabilities/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteLiability = (token: string, id: number) => window.confirm("¿Eliminar esta deuda?") ? apiRequest<{ message: string }>(`/liabilities/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const getGoals = (token: string) => apiRequest<Goal[]>("/goals/", token);
export const createGoal = (token: string, data: Omit<Goal, "id" | "user_id">) => apiRequest<Goal>("/goals/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteGoal = (token: string, id: number) => window.confirm("¿Eliminar esta meta?") ? apiRequest<{ message: string }>(`/goals/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const updateGoal = (token: string, id: number, data: Omit<Goal, "id" | "user_id">) => apiRequest<Goal>(`/goals/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export type MortgagePayload = Omit<Mortgage, "id" | "user_id" | "current_balance" | "remaining_months" | "next_due_date" | "monthly_payment" | "total_interest" | "next_interest" | "next_principal">;
export const getMortgages = (token: string) => apiRequest<Mortgage[]>("/mortgages/", token);
export const createMortgage = (token: string, data: MortgagePayload) => apiRequest<Mortgage>("/mortgages/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const updateMortgage = (token: string, id: number, data: MortgagePayload) => apiRequest<Mortgage>(`/mortgages/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteMortgage = (token: string, id: number) => apiRequest<{ message: string }>(`/mortgages/${id}`, token, { method: "DELETE" });
export const payMortgage = (token: string, id: number, amount: number, paid_date: string) => apiRequest(`/mortgages/${id}/payments`, token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, paid_date }) });
export const getMortgagePayments = (token: string, id: number) => apiRequest<CreditPayment[]>(`/mortgages/${id}/payments`, token);
export const getAmortization = (token: string, id: number) => apiRequest<AmortizationRow[]>(`/mortgages/${id}/amortization`, token);
