import { useState } from "react";

export default function LoginPage({ onLogin, onGotoRegister }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    device_name: "web-browser",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      await onLogin(form);
    } catch (error) {
      setErrorMessage(error.message || "Gagal login. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-sky-50 to-white px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-blue-100">
        <h1 className="text-2xl font-bold text-slate-900">Login Zyneo</h1>
        <p className="text-sm text-slate-500 mt-1">
          Login dulu sebelum input data atau melakukan pemesanan.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
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
            {isLoading ? "Memproses..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-5">
          Belum punya akun?{" "}
          <button
            type="button"
            onClick={onGotoRegister}
            className="font-semibold text-blue-600 hover:underline"
          >
            Register di sini
          </button>
        </p>
      </div>
    </div>
  );
}
