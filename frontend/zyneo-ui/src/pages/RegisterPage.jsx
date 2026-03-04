import { useState } from "react";

export default function RegisterPage({ onRegister, onGotoLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    if (form.password !== form.password_confirmation) {
      setErrorMessage("Konfirmasi password tidak sama.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    try {
      await onRegister(form);
    } catch (error) {
      setErrorMessage(error.message || "Gagal register. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#dbeafe_0%,_#eff6ff_40%,_#ffffff_100%)] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white/90 p-8 shadow-2xl border border-blue-100 backdrop-blur">
        <h1 className="text-3xl font-extrabold text-slate-900">Register Zyneo</h1>
        <p className="text-sm text-slate-500 mt-1">
          Buat akun baru untuk mulai menggunakan sistem rental Zyneo.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={form.name}
            onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
            placeholder="Nama"
            className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={event => setForm(prev => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={event => setForm(prev => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            type="password"
            required
            value={form.password_confirmation}
            onChange={event =>
              setForm(prev => ({ ...prev, password_confirmation: event.target.value }))
            }
            placeholder="Konfirmasi Password"
            className="w-full rounded-xl border border-blue-100 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {errorMessage && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-4 py-2.5 text-sm font-semibold text-white hover:from-blue-700 hover:to-sky-600 disabled:opacity-60 transition"
          >
            {isLoading ? "Memproses..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-5">
          Sudah punya akun?{" "}
          <button
            type="button"
            onClick={onGotoLogin}
            className="font-semibold text-blue-600 hover:underline"
          >
            Login di sini
          </button>
        </p>
      </div>
    </div>
  );
}
