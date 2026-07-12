import { useState } from "react";
import type { FormEvent } from "react";
import { ApiError } from "../../services/api";
import { login, register } from "../../services/financial.service";

type Props = { onLogin: (token: string) => void };

export default function LoginForm({ onLogin }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isRegistering) {
        await register(name, email, password);
        setIsRegistering(false);
        setError("Cuenta creada. Ahora inicia sesión.");
      } else {
        onLogin((await login(email, password)).access_token);
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
      <h1 className="text-3xl font-bold">Financial AI</h1>
      <p className="mt-2 text-slate-400">{isRegistering ? "Crea tu cuenta financiera." : "Ingresa para ver tus finanzas."}</p>
      {isRegistering && <><label className="mt-5 block text-sm text-slate-300">Nombre completo</label><input className="mt-2 w-full rounded-lg bg-slate-800 p-3" value={name} onChange={(event) => setName(event.target.value)} required /></>}
      <label className="mt-8 block text-sm text-slate-300">Correo</label>
      <input className="mt-2 w-full rounded-lg bg-slate-800 p-3" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      <label className="mt-5 block text-sm text-slate-300">Contraseña</label>
      <input className="mt-2 w-full rounded-lg bg-slate-800 p-3" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
      <button className="mt-6 w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950 disabled:opacity-60" disabled={loading}>{loading ? "Procesando..." : isRegistering ? "Crear cuenta" : "Ingresar"}</button>
      <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="mt-4 w-full text-sm text-cyan-400 hover:text-cyan-300">{isRegistering ? "Ya tengo una cuenta" : "Crear una cuenta"}</button>
    </form>
  </main>;
}
