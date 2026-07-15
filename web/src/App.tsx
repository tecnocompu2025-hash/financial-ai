import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginForm from "./components/auth/LoginFormV3";
import IncomeManagerV7 from "./components/dashboard/IncomeManagerV7";
import ExpenseManagerV6 from "./components/dashboard/ExpenseManagerV6";
import AccountsPayable from "./components/dashboard/AccountsPayable";
import AssetManagerV6 from "./components/dashboard/AssetManagerV6";
import LiabilityManagerV7 from "./components/dashboard/LiabilityManagerV7";
import GoalManagerV3 from "./components/dashboard/GoalManagerV3";
import ReportManagerV3 from "./components/dashboard/ReportManagerV3";
import SettingsManager from "./components/dashboard/SettingsManagerV2";
import Dashboard from "./pages/dashboard/Dashboard";
import { getCurrentUser } from "./services/financial.service";
import CreditManagerV3 from "./components/dashboard/CreditManagerV3";
import AmortizationManager from "./components/dashboard/AmortizationManager";
import PaymentsHubV3 from "./components/dashboard/PaymentsHubV3";
import DebtHubV2 from "./components/dashboard/DebtHubV2";
import CreditEditorV2 from "./components/dashboard/CreditEditorV2";
import CustomCreditManager from "./components/dashboard/CustomCreditManager";
import AdminUsers from "./components/dashboard/AdminUsers";
import AllDebts from "./components/dashboard/AllDebts";
import ResetPasswordForm from "./components/auth/ResetPasswordForm";
import { ApiError } from "./services/api";
import { CurrencyProvider } from "./contexts/CurrencyContext";

const TOKEN_KEY = "financial_ai_access_token";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [isSuperuser, setIsSuperuser] = useState(false);
  useEffect(() => {
    if (!token) return;
    void getCurrentUser(token)
      .then((user) => setIsSuperuser(Boolean(user.is_superuser)))
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          localStorage.removeItem(TOKEN_KEY);
          setToken(null);
          return;
        }
        setIsSuperuser(false);
      });
  }, [token]);
  if (!token) return <Routes>
    <Route path="/reset-password" element={<ResetPasswordForm />} />
    <Route path="*" element={<LoginForm onLogin={(value) => { localStorage.setItem(TOKEN_KEY, value); setToken(value); }} />} />
  </Routes>;
  const logout = () => { localStorage.removeItem(TOKEN_KEY); setToken(null); };
  
  return (
    <CurrencyProvider token={token}>
      <Routes>
        <Route path="/" element={isSuperuser ? <Navigate to="/admin/users" replace /> : <Dashboard token={token} onLogout={logout} />} />
        <Route path="/income" element={<IncomeManagerV7 token={token} />} />
        <Route path="/expense" element={<ExpenseManagerV6 token={token} />} />
        <Route path="/accounts-payable" element={<AccountsPayable token={token} />} />
        <Route path="/assets" element={<AssetManagerV6 token={token} />} />
        <Route path="/liabilities" element={<LiabilityManagerV7 token={token} />} />
        <Route path="/debts" element={<DebtHubV2 />} />
        <Route path="/all-debts" element={<AllDebts token={token} />} />
        <Route path="/credit-edit" element={<CreditEditorV2 token={token} />} />
        <Route path="/admin/users" element={<AdminUsers token={token} onLogout={logout} />} />
        <Route path="/mortgages" element={<CustomCreditManager token={token} />} />
        <Route path="/credit-history" element={<CreditManagerV3 token={token} />} />
        <Route path="/amortization" element={<AmortizationManager token={token} />} />
        <Route path="/payments" element={<PaymentsHubV3 token={token} />} />
        <Route path="/goals" element={<GoalManagerV3 token={token} />} />
        <Route path="/reports" element={<ReportManagerV3 token={token} />} />
        <Route path="/settings" element={<SettingsManager token={token} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CurrencyProvider>
  );
}

export default App;
