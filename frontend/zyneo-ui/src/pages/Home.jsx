import { useEffect, useMemo, useState } from "react";

const defaultPackages = [
  {
    id: 1,
    name: "Paket Elite",
    type: "PlayStation 5",
    version: "Digital Edition",
    controllers: 2,
    pricePerDay: 85000,
    status: "available",
  },
  {
    id: 2,
    name: "Paket Premium",
    type: "PlayStation 5",
    version: "Disc Edition",
    controllers: 2,
    pricePerDay: 95000,
    status: "rented",
  },
  {
    id: 3,
    name: "Paket Hemat",
    type: "PlayStation 4 Pro",
    version: "1TB",
    controllers: 2,
    pricePerDay: 65000,
    status: "available",
  },
];

const defaultSchedules = [
  {
    id: 1,
    customer: "Andi Pratama",
    package: "Paket Elite",
    date: "2026-02-12",
    time: "18:00 - 22:00",
    status: "confirmed",
  },
  {
    id: 2,
    customer: "Salsa Nur",
    package: "Paket Premium",
    date: "2026-02-13",
    time: "15:00 - 19:00",
    status: "pending",
  },
];

const packageFormInitial = {
  name: "",
  type: "",
  version: "",
  controllers: 2,
  pricePerDay: "",
  status: "available",
};

const scheduleFormInitial = {
  customer: "",
  package: "",
  date: "",
  time: "",
};

export default function Home({ user }) {
  const [playstations, setPlaystations] = useState(() => {
    const saved = localStorage.getItem("zyneo-packages");
    return saved ? JSON.parse(saved) : defaultPackages;
  });
  const [schedules, setSchedules] = useState(() => {
    const saved = localStorage.getItem("zyneo-schedules");
    return saved ? JSON.parse(saved) : defaultSchedules;
  });
  const [formState, setFormState] = useState(packageFormInitial);
  const [scheduleForm, setScheduleForm] = useState(scheduleFormInitial);
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeView, setActiveView] = useState("dashboard");
  const [formError, setFormError] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("zyneo-packages", JSON.stringify(playstations));
  }, [playstations]);

  useEffect(() => {
    localStorage.setItem("zyneo-schedules", JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const stats = useMemo(() => {
    const total = playstations.length;
    const available = playstations.filter(ps => ps.status === "available").length;
    const rented = playstations.filter(ps => ps.status === "rented").length;
    return { total, available, rented };
  }, [playstations]);

  const filteredPlaystations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return playstations.filter(ps => {
      const matchesStatus = statusFilter === "all" || ps.status === statusFilter;
      const matchesQuery =
        !query || `${ps.name} ${ps.type} ${ps.version}`.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [playstations, searchQuery, statusFilter]);

  const sortedSchedules = useMemo(
    () => [...schedules].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [schedules],
  );

  const handlePackageChange = event => {
    const { name, value } = event.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleScheduleChange = event => {
    const { name, value } = event.target;
    setScheduleForm(prev => ({ ...prev, [name]: value }));
  };

  const resetPackageForm = () => {
    setFormState(packageFormInitial);
    setEditingId(null);
    setFormError("");
    setActiveView("create");
  };

  const validatePackageForm = () => {
    if (!formState.name || !formState.type || !formState.version) {
      return "Nama paket, tipe, dan versi wajib diisi.";
    }
    if (Number(formState.controllers) < 1) {
      return "Jumlah controller minimal 1.";
    }
    if (Number(formState.pricePerDay) <= 0) {
      return "Harga per hari harus lebih dari 0.";
    }
    return "";
  };

  const handlePackageSubmit = event => {
    event.preventDefault();
    const validationError = validatePackageForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      ...formState,
      controllers: Number(formState.controllers),
      pricePerDay: Number(formState.pricePerDay),
    };

    if (editingId) {
      setPlaystations(prev => prev.map(ps => (ps.id === editingId ? { ...ps, ...payload } : ps)));
      setToast("Paket berhasil diperbarui.");
    } else {
      const nextId = Math.max(0, ...playstations.map(ps => ps.id)) + 1;
      setPlaystations(prev => [...prev, { id: nextId, ...payload }]);
      setToast("Paket baru berhasil ditambahkan.");
    }

    resetPackageForm();
  };

  const handleEdit = ps => {
    setEditingId(ps.id);
    setFormState({
      name: ps.name,
      type: ps.type,
      version: ps.version,
      controllers: ps.controllers,
      pricePerDay: ps.pricePerDay,
      status: ps.status,
    });
    setActiveView("create");
    setFormError("");
  };

  const handleDelete = id => {
    const selected = playstations.find(ps => ps.id === id);
    const confirmed = window.confirm(`Hapus ${selected?.name || "paket"}?`);
    if (!confirmed) return;

    setPlaystations(prev => prev.filter(ps => ps.id !== id));
    if (editingId === id) resetPackageForm();
    setToast("Paket berhasil dihapus.");
  };

  const handleScheduleSubmit = event => {
    event.preventDefault();
    if (
      !scheduleForm.customer ||
      !scheduleForm.package ||
      !scheduleForm.date ||
      !scheduleForm.time
    ) {
      setToast("Lengkapi data jadwal terlebih dahulu.");
      return;
    }

    const nextId = Math.max(0, ...schedules.map(item => item.id)) + 1;
    setSchedules(prev => [...prev, { id: nextId, ...scheduleForm, status: "pending" }]);
    setScheduleForm(scheduleFormInitial);
    setToast("Jadwal rental berhasil ditambahkan.");
  };

  const toggleScheduleStatus = id => {
    setSchedules(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: item.status === "confirmed" ? "pending" : "confirmed",
            }
          : item,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {toast && (
          <div className="fixed right-6 top-24 z-50 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
            {toast}
          </div>
        )}

        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Zyneo Rental Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Penyempurnaan Sistem Penyewaan PlayStation
          </h1>
          <p className="text-slate-600 max-w-2xl">
            Sekarang dashboard lebih siap digunakan: data paket & jadwal tersimpan di browser,
            form tervalidasi, dan aksi utama lebih jelas.
            {user ? ` Login sebagai ${user.name}.` : ""}
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActiveView("create")}
              className={`rounded-xl px-4 py-2 text-sm font-semibold shadow-sm transition ${
                activeView === "create"
                  ? "bg-blue-700 text-white"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Buat Paket Baru
            </button>
            <button
              type="button"
              onClick={() => setActiveView("schedule")}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                activeView === "schedule"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              Lihat Jadwal Rental
            </button>
            <button
              type="button"
              onClick={() => setActiveView("dashboard")}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                activeView === "dashboard"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-blue-200 bg-white text-blue-600 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              Dashboard Utama
            </button>
          </div>
        </header>

        {activeView === "schedule" ? (
          <section className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
              <h2 className="text-xl font-semibold text-slate-900">Tambah Jadwal Rental</h2>
              <form onSubmit={handleScheduleSubmit} className="mt-4 grid gap-3 md:grid-cols-2">
                <input
                  name="customer"
                  value={scheduleForm.customer}
                  onChange={handleScheduleChange}
                  placeholder="Nama pelanggan"
                  className="rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  name="package"
                  value={scheduleForm.package}
                  onChange={handleScheduleChange}
                  className="rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Pilih paket</option>
                  {playstations.map(ps => (
                    <option key={ps.id} value={ps.name}>
                      {ps.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  name="date"
                  value={scheduleForm.date}
                  onChange={handleScheduleChange}
                  className="rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  name="time"
                  value={scheduleForm.time}
                  onChange={handleScheduleChange}
                  placeholder="Contoh: 10:00 - 14:00"
                  className="rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="md:col-span-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Simpan Jadwal
                </button>
              </form>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {sortedSchedules.map(item => (
                <div key={item.id} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {new Date(item.date).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        · {item.time}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">{item.customer}</h3>
                      <p className="text-sm text-blue-700">{item.package}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "confirmed"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      {item.status === "confirmed" ? "Terkonfirmasi" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleScheduleStatus(item.id)}
                      className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
                    >
                      Ubah Status
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100">
                <p className="text-sm text-slate-500">Total Paket</p>
                <p className="text-2xl font-semibold text-slate-900">{stats.total}</p>
              </div>
              <div className="bg-blue-600 rounded-2xl shadow-sm p-5 text-white">
                <p className="text-sm text-blue-100">Tersedia</p>
                <p className="text-2xl font-semibold">{stats.available}</p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100">
                <p className="text-sm text-slate-500">Sedang Disewa</p>
                <p className="text-2xl font-semibold text-blue-700">{stats.rented}</p>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <h2 className="text-xl font-semibold text-slate-900">Daftar Paket PlayStation</h2>
                  <div className="flex flex-wrap gap-2">
                    {["all", "available", "rented"].map(status => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setStatusFilter(status)}
                        className={`rounded-full px-4 py-1 text-xs font-semibold transition ${
                          statusFilter === status
                            ? "bg-blue-600 text-white"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                      >
                        {status === "all" ? "Semua" : status === "available" ? "Tersedia" : "Disewa"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={event => setSearchQuery(event.target.value)}
                    placeholder="Cari paket atau tipe PS..."
                    className="w-full md:max-w-xs rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs font-semibold text-blue-600">
                    Menampilkan {filteredPlaystations.length} dari {playstations.length} paket
                  </p>
                </div>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm">
                    <thead className="text-left text-slate-500 border-b">
                      <tr>
                        <th className="py-3 pr-4">Nama Paket</th>
                        <th className="py-3 pr-4">Tipe</th>
                        <th className="py-3 pr-4">Harga/Hari</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPlaystations.map(ps => (
                        <tr key={ps.id} className="border-b last:border-b-0 hover:bg-blue-50/40">
                          <td className="py-3 pr-4">
                            <p className="font-semibold text-slate-900">{ps.name}</p>
                            <p className="text-xs text-slate-500">{ps.type} · {ps.version}</p>
                          </td>
                          <td className="py-3 pr-4">{ps.controllers} controller</td>
                          <td className="py-3 pr-4">Rp {ps.pricePerDay.toLocaleString()}</td>
                          <td className="py-3 pr-4">
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                              {ps.status === "available" ? "Tersedia" : "Disewa"}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleEdit(ps)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(ps.id)}
                                className="px-3 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-600 hover:bg-slate-100"
                              >
                                Hapus
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
                <h2 className="text-xl font-semibold text-slate-900">
                  {editingId ? "Edit Paket" : "Tambah Paket Baru"}
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Form tervalidasi dan siap dipakai untuk alur CRUD frontend.
                </p>

                <form className="mt-6 space-y-4" onSubmit={handlePackageSubmit}>
                  <input
                    type="text"
                    name="name"
                    value={formState.name}
                    onChange={handlePackageChange}
                    placeholder="Nama paket"
                    className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="type"
                    value={formState.type}
                    onChange={handlePackageChange}
                    placeholder="Tipe PlayStation"
                    className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    name="version"
                    value={formState.version}
                    onChange={handlePackageChange}
                    placeholder="Versi / Storage"
                    className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      name="controllers"
                      min="1"
                      value={formState.controllers}
                      onChange={handlePackageChange}
                      className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      name="pricePerDay"
                      min="0"
                      value={formState.pricePerDay}
                      onChange={handlePackageChange}
                      placeholder="Harga / hari"
                      className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    name="status"
                    value={formState.status}
                    onChange={handlePackageChange}
                    className="w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="available">Tersedia</option>
                    <option value="rented">Disewa</option>
                  </select>

                  {formError && (
                    <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600">
                      {formError}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                    >
                      {editingId ? "Simpan Perubahan" : "Tambah Paket"}
                    </button>
                    <button
                      type="button"
                      onClick={resetPackageForm}
                      className="px-5 py-2 rounded-xl border border-blue-200 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
