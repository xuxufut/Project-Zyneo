export default function Navbar({ user, onLogout }) {
  return (
    <nav className="sticky top-0 z-40 border-b border-white/40 bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">
            Zyneo
          </p>
          <h1 className="text-lg font-bold">PlayStation Rental Management</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-blue-50 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white border border-white/20">
            {user ? `👋 ${user.name}` : "Status: Online"}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-1.5 rounded-full bg-white text-blue-700 font-semibold hover:bg-blue-50 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
