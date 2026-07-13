import { useState, type FormEvent } from "react";

import { ApiError } from "../../services/api";
import { login, register, requestPasswordReset } from "../../services/financial.service";

type Mode = "login" | "register" | "recover";

export default function LoginFormV3({ onLogin }: { onLogin: (token: string) => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function passwordIsSecure(value: string) {
    return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    if (mode === "register" && (!name.trim() || !passwordIsSecure(password))) {
      setMessage("Usa tu nombre y una contraseña de al menos 8 caracteres con letras y números.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "recover") {
        setMessage((await requestPasswordReset(email)).message);
      } else if (mode === "register") {
        await register(name.trim(), email, password);
        setMode("login");
        setPassword("");
        setMessage("Cuenta creada. Ahora inicia sesión.");
      } else {
        onLogin((await login(email, password)).access_token);
      }
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : "No fue posible conectarse con el servidor. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <h1 className="text-3xl font-bold">Financial AI</h1>
      <p className="mt-2 text-slate-400">{mode === "recover" ? "Te enviaremos un enlace de recuperación." : mode === "register" ? "Crea tu cuenta financiera." : "Ingresa para ver tus finanzas."}</p>
      {mode === "register" && <input className="mt-5 w-full rounded-lg bg-slate-800 p-3" placeholder="Nombre completo" value={name} onChange={(event) => setName(event.target.value)} required />}
      <input className="mt-5 w-full rounded-lg bg-slate-800 p-3" type="email" placeholder="Correo" value={email} onChange={(event) => setEmail(event.target.value)} required />
      {mode !== "recover" && <input className="mt-5 w-full rounded-lg bg-slate-800 p-3" type="password" minLength={8} placeholder="Contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />}
      {message && <p role="alert" className="mt-4 text-sm text-cyan-300">{message}</p>}
      <button disabled={loading} className="mt-6 w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-60">{loading ? "Procesando..." : mode === "recover" ? "Enviar enlace" : mode === "register" ? "Crear cuenta" : "Ingresar"}</button>
      <button type="button" onClick={() => { setMode(mode === "register" ? "login" : "register"); setMessage(""); }} className="mt-4 w-full text-sm text-cyan-400">{mode === "register" ? "Ya tengo una cuenta" : "Crear una cuenta"}</button>
      {mode !== "register" && <button type="button" onClick={() => { setMode(mode === "recover" ? "login" : "recover"); setMessage(""); }} className="mt-3 w-full text-sm text-cyan-400">{mode === "recover" ? "Volver a iniciar sesión" : "Olvidé mi contraseña"}</button>}
    </form>
  </main>;
}
