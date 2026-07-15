import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getProfile } from "../services/financial.service";

type CurrencyContextType = {
  baseCurrency: string;
  isUSD: boolean;
  toggleCurrency: () => void;
  formatCurrency: (amount: number, compact?: boolean, sourceCurrency?: string) => string;
  isLoading: boolean;
  exchangeRate: number;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ token, children }: { token: string | null; children: ReactNode }) {
  const [baseCurrency, setBaseCurrency] = useState("PEN"); // Default
  const [isUSD, setIsUSD] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    let currentBase = "PEN";
    setIsLoading(true);

    const initCurrency = async () => {
      try {
        const profile = await getProfile(token);
        if (profile?.currency) {
          currentBase = profile.currency;
          setBaseCurrency(profile.currency);
        }
        
        if (profile?.custom_exchange_rate && profile.custom_exchange_rate > 0) {
          setExchangeRate(profile.custom_exchange_rate);
          setIsLoading(false);
          return; // Stop here, don't fetch from API
        }
        
        // Fetch exchange rates from baseCurrency to USD
        const res = await fetch("https://open.er-api.com/v6/latest/USD");
        const data = await res.json();
        if (data?.rates && data.rates[currentBase]) {
          setExchangeRate(data.rates[currentBase]);
        }
      } catch (error) {
        console.error("Error inicializando moneda:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void initCurrency();
  }, [token]);

  const toggleCurrency = () => setIsUSD((prev) => !prev);

  const formatCurrency = (amount: number, compact?: boolean, sourceCurrency?: string) => {
    let safeCurrency = sourceCurrency || baseCurrency;
    
    if (!/^[A-Z]{3}$/.test(safeCurrency)) {
      safeCurrency = "PEN";
    }

    // If we are in "Global USD" mode, everything is converted to USD
    if (isUSD) {
      const isAlreadyUSD = safeCurrency === 'USD';
      const convertedAmount = isAlreadyUSD ? amount : (exchangeRate > 0 ? amount / exchangeRate : amount);
      const options: Intl.NumberFormatOptions = { style: 'currency', currency: 'USD', notation: compact ? "compact" : "standard" };
      try {
        return new Intl.NumberFormat('en-US', options).format(convertedAmount);
      } catch (e) {
        return `USD ${convertedAmount.toFixed(2)}`;
      }
    }

    // Normal mode: display in its source currency, or convert USD to local if global is local?
    // Actually, if it's normal mode, just display it as registered! 
    // This allows the user to see exactly what they entered.
    const options: Intl.NumberFormatOptions = { style: 'currency', currency: safeCurrency, notation: compact ? "compact" : "standard" };
    try {
      return new Intl.NumberFormat('es-PE', options).format(amount);
    } catch (e) {
      return `${safeCurrency} ${amount.toFixed(2)}`;
    }
  };

  return (
    <CurrencyContext.Provider value={{ baseCurrency, isUSD, toggleCurrency, formatCurrency, isLoading, exchangeRate }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
