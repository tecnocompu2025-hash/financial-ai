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
      if (value) { const { id, ...data } = value; setProfile(data); setProfileExists(true); }
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
      <form onSubmit={saveFinancialProfile} className="rounded-lg bg-slate-900 p-6 space-y-3"><h2 className="text-xl font-semibold">Perfil financiero</h2><input value={profile.country} onChange={(e) => setField("country", e.target.value)} placeholder="País" className="w-full rounded bg-slate-800 p-3" required /><input value={profile.currency} onChange={(e) => setField("currency", e.target.value)} placeholder="Moneda" className="w-full rounded bg-slate-800 p-3" required /><input type="number" min="18" value={profile.age} onChange={(e) => setField("age", Number(e.target.value))} placeholder="Edad" className="w-full rounded bg-slate-800 p-3" required /><input value={profile.marital_status} onChange={(e) => setField("marital_status", e.target.value)} placeholder="Estado civil" className="w-full rounded bg-slate-800 p-3" required /><input type="number" min="0" value={profile.children} onChange={(e) => setField("children", Number(e.target.value))} placeholder="Número de hijos" className="w-full rounded bg-slate-800 p-3" required /><input type="number" min="18" value={profile.retirement_age} onChange={(e) => setField("retirement_age", Number(e.target.value))} placeholder="Edad de retiro" className="w-full rounded bg-slate-800 p-3" required /><input value={profile.financial_goal} onChange={(e) => setField("financial_goal", e.target.value)} placeholder="Meta financiera" className="w-full rounded bg-slate-800 p-3" required /><input type="number" min="0" step="0.01" value={profile.monthly_salary} onChange={(e) => setField("monthly_salary", Number(e.target.value))} placeholder="Ingreso mensual" className="w-full rounded bg-slate-800 p-3" required /><button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-slate-950">Guardar perfil</button></form></div>{message && <p className="mt-5 text-cyan-300">{message}</p>}</main>;
}
