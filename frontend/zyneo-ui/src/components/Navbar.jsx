export default function Navbar({ user, onLogout }) {
  return (
    <nav className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-100">
            Zyneo
          </p>
          <h1 className="text-lg font-bold">Playstation Rental CRUD</h1>
        </div>
        <div className="flex items-center gap-3 text-sm text-blue-50 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-white/15 text-white">
            {user ? `Halo, ${user.name}` : "Status: Online"}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="px-3 py-1 rounded-full bg-white/20 text-white hover:bg-white/30"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
