import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { changePassword, getCurrentUser, getProfile, saveProfile } from "../../services/financial.service";
import type { Profile, User } from "../../types/financial";

const emptyProfile: Omit<Profile, "id"> = { country: "", currency: "", age: 18, marital_status: "", children: 0, retirement_age: 65, financial_goal: "", monthly_salary: 0 };

export default function SettingsManagerV2({ token }: { token: string }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Omit<Profile, "id">>(emptyProfile);
  const [profileExists, setProfileExists] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    void getCurrentUser(token).then(setUser);
    void getProfile(token).then((value) => {
      if (value) { const { id: _id, ...data } = value; setProfile(data); setProfileExists(true); }
    });
  }, [token]);

  function setField<K extends keyof Omit<Profile, "id">>(field: K, value: Omit<Profile, "id">[K]) {
    setProfile((current) => ({ ...current, [field]: value }));
  }

  async function saveFinancialProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await saveProfile(token, profile, profileExists);
      setProfileExists(true);
      setMessage("Perfil financiero guardado correctamente.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo guardar el perfil."); }
  }

  async function changeUserPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget);
    try { const result = await changePassword(token, String(form.get("current")), String(form.get("password")), String(form.get("confirm"))); setMessage(result.message); event.currentTarget.reset(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "No se pudo actualizar la contraseña."); }
  }

  function logout() { localStorage.removeItem("financial_ai_access_token"); window.location.assign("/"); }

  return <main className="min-h-screen bg-slate-950 p-6 text-white"><Link to="/" className="text-cyan-400">Dashboard</Link><h1 className="mt-5 text-3xl font-bold">Configuración</h1>
    <div className="mt-8 grid max-w-4xl gap-6 lg:grid-cols-2"><section className="rounded-lg bg-slate-900 p-6"><h2 className="text-xl font-semibold">Cuenta</h2><p className="mt-4 text-slate-400">Nombre</p><p>{user?.name ?? "Cargando..."}</p><p className="mt-3 text-slate-400">Correo</p><p>{user?.email ?? ""}</p>
      <form onSubmit={changeUserPassword} className="mt-6 space-y-3"><h3 className="font-semibold">Cambiar contraseña</h3><input name="current" type="password" placeholder="Contraseña actual" className="w-full rounded bg-slate-800 p-3" required /><input name="password" type="password" minLength={8} placeholder="Nueva contraseña" className="w-full rounded bg-slate-800 p-3" required /><input name="confirm" type="password" minLength={8} placeholder="Confirmar nueva contraseña" className="w-full rounded bg-slate-800 p-3" required /><button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Actualizar contraseña</button></form><button onClick={logout} className="mt-8 rounded bg-red-500 px-5 py-3 font-semibold">Cerrar sesión</button></section>
      <form onSubmit={saveFinancialProfile} className="rounded-lg bg-slate-900 p-6 space-y-3">
        <h2 className="text-xl font-semibold">Perfil financiero</h2>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">País de residencia</span>
          <input value={profile.country} onChange={(e) => setField("country", e.target.value)} placeholder="Ej. Perú" className="w-full rounded bg-slate-800 p-3" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Moneda principal</span>
          <select value={profile.currency} onChange={(e) => setField("currency", e.target.value)} className="w-full rounded bg-slate-800 p-3" required>
          <option value="" disabled>Selecciona tu moneda local</option>
          <option value="USD">Dólares Estadounidenses (USD)</option>
          <option value="EUR">Euros (EUR)</option>
          <option value="PEN">Soles Peruanos (PEN)</option>
          <option value="MXN">Pesos Mexicanos (MXN)</option>
          <option value="COP">Pesos Colombianos (COP)</option>
          <option value="ARS">Pesos Argentinos (ARS)</option>
          <option value="CLP">Pesos Chilenos (CLP)</option>
          <option value="BRL">Reales Brasileños (BRL)</option>
          <option value="VES">Bolívares Venezolanos (VES)</option>
          <option value="BOB">Bolivianos (BOB)</option>
          <option value="PYG">Guaraníes Paraguayos (PYG)</option>
          <option value="UYU">Pesos Uruguayos (UYU)</option>
          <option value="DOP">Pesos Dominicanos (DOP)</option>
          <option value="CRC">Colones Costarricenses (CRC)</option>
          <option value="PAB">Balboas Panameños (PAB)</option>
          <option value="GTQ">Quetzales Guatemaltecos (GTQ)</option>
          <option value="HNL">Lempiras Hondureños (HNL)</option>
          <option value="NIO">Córdobas Nicaragüenses (NIO)</option>
          <option value="CAD">Dólares Canadienses (CAD)</option>
          <option value="GBP">Libras Esterlinas (GBP)</option>
          <option value="JPY">Yenes Japoneses (JPY)</option>
          <option value="CNY">Yuanes Chinos (CNY)</option>
          <option value="AUD">Dólares Australianos (AUD)</option>
          <option value="CHF">Francos Suizos (CHF)</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Edad actual</span>
          <input type="number" min="18" value={profile.age} onChange={(e) => setField("age", Number(e.target.value))} placeholder="Ej. 30" className="w-full rounded bg-slate-800 p-3" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Estado civil</span>
          <input value={profile.marital_status} onChange={(e) => setField("marital_status", e.target.value)} placeholder="Ej. Soltero(a), Casado(a)" className="w-full rounded bg-slate-800 p-3" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Número de hijos (dependientes)</span>
          <input type="number" min="0" value={profile.children} onChange={(e) => setField("children", Number(e.target.value))} placeholder="0" className="w-full rounded bg-slate-800 p-3" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Edad de retiro deseada</span>
          <input type="number" min="18" value={profile.retirement_age} onChange={(e) => setField("retirement_age", Number(e.target.value))} placeholder="Ej. 65" className="w-full rounded bg-slate-800 p-3" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Tu principal meta financiera</span>
          <input value={profile.financial_goal} onChange={(e) => setField("financial_goal", e.target.value)} placeholder="Ej. Comprar casa, Libertad financiera" className="w-full rounded bg-slate-800 p-3" required />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-slate-400">Ingreso mensual promedio</span>
          <input type="number" min="0" step="0.01" value={profile.monthly_salary} onChange={(e) => setField("monthly_salary", Number(e.target.value))} placeholder="Ej. 2500" className="w-full rounded bg-slate-800 p-3" required />
        </label>
        <div className="pt-3 border-t border-slate-800">
          <p className="mb-2 text-sm text-slate-400">Tipo de cambio personalizado (Local a USD). Deja en 0 para usar la tasa automática en vivo.</p>
          <input type="number" min="0" step="0.0001" value={profile.custom_exchange_rate ?? 0} onChange={(e) => setField("custom_exchange_rate", Number(e.target.value))} placeholder="Ej. 3.80" className="w-full rounded bg-slate-800 p-3" />
        </div>
        <div className="pt-3 border-t border-slate-800">
          <h3 className="mb-2 font-semibold">Fondos Virtuales (Opcional)</h3>
          <p className="mb-2 text-sm text-slate-400">Porcentaje de tus ingresos destinado a Donaciones. Si colocas 0%, no se acumulará este fondo.</p>
          <input type="number" min="0" max="100" step="0.1" value={profile.donation_percentage ?? 0} onChange={(e) => setField("donation_percentage", Number(e.target.value))} placeholder="Ej. 10 para 10%" className="mb-4 w-full rounded bg-slate-800 p-3" />
          
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-slate-400">Porcentaje destinado a Calidad de Vida. Si colocas 0%, no se acumulará.</span>
            <div className="group relative flex items-center justify-center">
              <div className="flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white hover:bg-slate-500">?</div>
              <div className="absolute bottom-full left-1/2 mb-2 hidden w-64 -translate-x-1/2 rounded bg-slate-800 p-2 text-xs font-normal text-white shadow-lg group-hover:block z-10 text-center border border-slate-700 pointer-events-none">
                Este es un fondo o ahorro diseñado para mejorar tu estilo de vida en el futuro, o puede usarse estratégicamente para pagar deudas e invertir.
              </div>
            </div>
          </div>
          <input type="number" min="0" max="100" step="0.1" value={profile.quality_of_life_percentage ?? 0} onChange={(e) => setField("quality_of_life_percentage", Number(e.target.value))} placeholder="Ej. 15 para 15%" className="w-full rounded bg-slate-800 p-3" />
        </div>
        <button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Guardar perfil</button>
      </form>
    </div>
    {message && <p className="mt-5 text-cyan-300">{message}</p>}
  </main>;
}
