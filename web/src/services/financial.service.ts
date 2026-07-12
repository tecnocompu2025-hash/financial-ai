import { apiRequest } from "./api";
import type { Asset, Expense, Goal, Income, Liability, LoginResponse, User } from "../types/financial";

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>("/auth/login", undefined, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
}

export function register(name: string, email: string, password: string) {
  return apiRequest<{ message: string }>("/auth/register", undefined, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, password }) });
}

export const getIncomes = (token: string) => apiRequest<Income[]>("/income/", token);
export const getExpenses = (token: string) => apiRequest<Expense[]>("/expense/", token);
export const getCurrentUser = (token: string) => apiRequest<User>("/auth/me", token);

export type IncomePayload = Omit<Income, "id" | "user_id" | "created_at">;

export const createIncome = (token: string, data: IncomePayload) => apiRequest<Income>("/income/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const updateIncome = (token: string, id: number, data: IncomePayload) => apiRequest<Income>(`/income/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteIncome = (token: string, id: number) => apiRequest<{ message: string }>(`/income/${id}`, token, { method: "DELETE" });

export type ExpensePayload = Omit<Expense, "id" | "user_id">;
export const createExpense = (token: string, data: ExpensePayload) => apiRequest<Expense>("/expense/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteExpense = (token: string, id: number) => window.confirm("¿Eliminar este gasto?") ? apiRequest<{ message: string }>(`/expense/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const getAssets = (token: string) => apiRequest<Asset[]>("/assets/", token);
export const createAsset = (token: string, data: Omit<Asset, "id" | "user_id">) => apiRequest<Asset>("/assets/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteAsset = (token: string, id: number) => window.confirm("¿Eliminar este activo?") ? apiRequest<{ message: string }>(`/assets/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const getLiabilities = (token: string) => apiRequest<Liability[]>("/liabilities/", token);
export const createLiability = (token: string, data: Omit<Liability, "id" | "user_id">) => apiRequest<Liability>("/liabilities/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteLiability = (token: string, id: number) => window.confirm("¿Eliminar esta deuda?") ? apiRequest<{ message: string }>(`/liabilities/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const getGoals = (token: string) => apiRequest<Goal[]>("/goals/", token);
export const createGoal = (token: string, data: Omit<Goal, "id" | "user_id">) => apiRequest<Goal>("/goals/", token, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
export const deleteGoal = (token: string, id: number) => window.confirm("¿Eliminar esta meta?") ? apiRequest<{ message: string }>(`/goals/${id}`, token, { method: "DELETE" }) : Promise.resolve({ message: "Cancelado" });
export const updateGoal = (token: string, id: number, data: Omit<Goal, "id" | "user_id">) => apiRequest<Goal>(`/goals/${id}`, token, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
