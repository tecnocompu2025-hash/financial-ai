import { useState } from "react";
import LoginForm from "./components/auth/LoginForm";
import IncomeManagerV3 from "./components/dashboard/IncomeManagerV3";
import ExpenseManagerV2 from "./components/dashboard/ExpenseManagerV2";
import AssetManagerV3 from "./components/dashboard/AssetManagerV3";
import LiabilityManagerV3 from "./components/dashboard/LiabilityManagerV3";
import GoalManager from "./components/dashboard/GoalManager";
import ReportManager from "./components/dashboard/ReportManager";
import SettingsManager from "./components/dashboard/SettingsManager";
import Dashboard from "./pages/dashboard/Dashboard";

const TOKEN_KEY = "financial_ai_access_token";

function App() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  if (!token) return <LoginForm onLogin={(value) => { localStorage.setItem(TOKEN_KEY, value); setToken(value); }} />;
  if (window.location.pathname === "/income") return <IncomeManagerV3 token={token} />;
  if (window.location.pathname === "/expense") return <ExpenseManagerV2 token={token} />;
  if (window.location.pathname === "/assets") return <AssetManagerV3 token={token} />;
  if (window.location.pathname === "/liabilities") return <LiabilityManagerV3 token={token} />;
  if (window.location.pathname === "/goals") return <GoalManager token={token} />;
  if (window.location.pathname === "/reports") return <ReportManager token={token} />;
  if (window.location.pathname === "/settings") return <SettingsManager token={token} />;
  return <Dashboard token={token} onLogout={() => { localStorage.removeItem(TOKEN_KEY); setToken(null); }} />;
}

export default App;
