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
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type Asset = { id: number; user_id: number; name: string; category: string; value: number };
export type Liability = { id: number; user_id: number; name: string; category: string; balance: number };
export type Goal = { id: number; user_id: number; name: string; target_amount: number; current_amount: number };
