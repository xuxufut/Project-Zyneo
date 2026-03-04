import { Link, Navigate } from "react-router-dom";
import { useState } from "react";

export default function RegisterPage({ isAuthenticated, onRegister }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-blue-100">
        <h1 className="text-2xl font-bold text-slate-900">Register Zyneo</h1>
        <p className="text-sm text-slate-500 mt-1">
          Buat akun dulu untuk mulai input paket dan pemesanan rental.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            required
            value={form.name}
            onChange={event => setForm(prev => ({ ...prev, name: event.target.value }))}
            placeholder="Nama"
            className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            required
            value={form.email}
            onChange={event => setForm(prev => ({ ...prev, email: event.target.value }))}
            placeholder="Email"
            className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            required
            value={form.password}
            onChange={event => setForm(prev => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            required
            value={form.password_confirmation}
            onChange={event =>
              setForm(prev => ({ ...prev, password_confirmation: event.target.value }))
            }
            placeholder="Konfirmasi Password"
            className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {errorMessage && (
            <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {isLoading ? "Memproses..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-5">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-semibold text-blue-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}
