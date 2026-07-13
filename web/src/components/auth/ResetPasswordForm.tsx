import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { confirmPasswordReset } from "../../services/financial.service";

export default function ResetPasswordForm() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const token = params.get("token") ?? "";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setMessage("La contraseña debe tener al menos 8 caracteres, letras y números.");
      return;
    }
    if (password !== confirmation) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
    try {
      setMessage((await confirmPasswordReset(token, password, confirmation)).message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo restablecer la contraseña.");
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
      <h1 className="text-3xl font-bold">Nueva contraseña</h1>
      <p className="mt-2 text-slate-400">Elige una contraseña segura para tu cuenta.</p>
      {!token ? <p className="mt-5 text-sm text-red-300">El enlace de recuperación no es válido.</p> : <>
        <input className="mt-5 w-full rounded-lg bg-slate-800 p-3" type="password" placeholder="Nueva contraseña" value={password} onChange={(event) => setPassword(event.target.value)} required />
        <input className="mt-4 w-full rounded-lg bg-slate-800 p-3" type="password" placeholder="Confirmar contraseña" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} required />
        {message && <p className="mt-4 text-sm text-cyan-300">{message}</p>}
        <button className="mt-6 w-full rounded-lg bg-cyan-500 p-3 font-semibold text-slate-950">Restablecer contraseña</button>
      </>}
      <Link to="/" className="mt-4 block text-center text-sm text-cyan-400">Volver a iniciar sesión</Link>
    </form>
  </main>;
}
