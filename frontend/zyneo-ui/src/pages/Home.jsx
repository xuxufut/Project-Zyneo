import { useMemo, useState } from "react";

export default function Home() {
  const [playstations, setPlaystations] = useState([
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
  ]);
  const [formState, setFormState] = useState({
    name: "",
    type: "",
    version: "",
    controllers: 2,
    pricePerDay: "",
    status: "available",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeView, setActiveView] = useState("dashboard");

  const stats = useMemo(() => {
    const total = playstations.length;
    const available = playstations.filter(ps => ps.status === "available").length;
    const rented = playstations.filter(ps => ps.status === "rented").length;
    return { total, available, rented };
  }, [playstations]);

  const scheduleItems = useMemo(
    () => [
      {
        id: 1,
        customer: "Andi Pratama",
        package: "Paket Elite",
        date: "12 Feb 2026",
        time: "18.00 - 22.00",
        status: "confirmed",
      },
      {
        id: 2,
        customer: "Salsa Nur",
        package: "Paket Premium",
        date: "13 Feb 2026",
        time: "15.00 - 19.00",
        status: "pending",
      },
      {
        id: 3,
        customer: "Raka W",
        package: "Paket Hemat",
        date: "14 Feb 2026",
        time: "12.00 - 16.00",
        status: "confirmed",
      },
    ],
    [],
  );

  const filteredPlaystations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return playstations.filter(ps => {
      const matchesStatus =
        statusFilter === "all" ? true : ps.status === statusFilter;
      const matchesQuery = query
        ? `${ps.name} ${ps.type} ${ps.version}`.toLowerCase().includes(query)
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [playstations, searchQuery, statusFilter]);

  const handleChange = event => {
    const { name, value } = event.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormState({
      name: "",
      type: "",
      version: "",
      controllers: 2,
      pricePerDay: "",
      status: "available",
    });
    setEditingId(null);
    setActiveView("create");
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (!formState.name || !formState.type || !formState.pricePerDay) {
      return;
    }

    if (editingId) {
      setPlaystations(prev =>
        prev.map(ps =>
          ps.id === editingId
            ? {
                ...ps,
                ...formState,
                controllers: Number(formState.controllers),
                pricePerDay: Number(formState.pricePerDay),
              }
            : ps,
        ),
      );
    } else {
      const nextId = Math.max(0, ...playstations.map(ps => ps.id)) + 1;
      setPlaystations(prev => [
        ...prev,
        {
          id: nextId,
          ...formState,
          controllers: Number(formState.controllers),
          pricePerDay: Number(formState.pricePerDay),
        },
      ]);
    }
    resetForm();
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
  };

  const handleDelete = id => {
    setPlaystations(prev => prev.filter(ps => ps.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-1 text-xs font-semibold text-blue-700">
            <span className="h-2 w-2 rounded-full bg-blue-600" />
            Zyneo Rental Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Kelola Penyewaan PlayStation Lebih Cepat
          </h1>
          <p className="text-slate-600 max-w-2xl">
            UI dummy yang interaktif untuk melihat, menambah, serta mengelola
            paket sewa PlayStation. Semua perubahan langsung terlihat tanpa
            reload.
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
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
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
          <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100 space-y-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">
                  Jadwal Rental
                </h2>
                <p className="text-sm text-slate-500">
                  Pantau jadwal sewa aktif dan konfirmasi pelanggan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveView("dashboard")}
                className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
              >
                Kembali ke Dashboard
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {scheduleItems.map(item => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-blue-100 bg-blue-50/40 p-5 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-500">
                        {item.date} · {item.time}
                      </p>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {item.customer}
                      </h3>
                      <p className="text-sm text-blue-700">{item.package}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.status === "confirmed"
                          ? "bg-blue-600 text-white"
                          : "bg-white text-blue-700 border border-blue-200"
                      }`}
                    >
                      {item.status === "confirmed" ? "Terkonfirmasi" : "Pending"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-700"
                    >
                      Lihat Detail
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-blue-200 px-3 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Kirim Pengingat
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
                <p className="text-2xl font-semibold text-slate-900">
                  {stats.total}
                </p>
              </div>
              <div className="bg-blue-600 rounded-2xl shadow-sm p-5 text-white">
                <p className="text-sm text-blue-100">Tersedia</p>
                <p className="text-2xl font-semibold">
                  {stats.available}
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-5 border border-blue-100">
                <p className="text-sm text-slate-500">Sedang Disewa</p>
                <p className="text-2xl font-semibold text-blue-700">
                  {stats.rented}
                </p>
              </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      Daftar Paket PlayStation
                    </h2>
                    <span className="text-sm text-slate-500">
                      Update terakhir: Hari ini
                    </span>
                  </div>
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
                        {status === "all"
                          ? "Semua"
                          : status === "available"
                          ? "Tersedia"
                          : "Disewa"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="relative w-full md:max-w-xs">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={event => setSearchQuery(event.target.value)}
                      placeholder="Cari paket atau tipe PS..."
                      className="w-full rounded-xl border border-blue-100 bg-blue-50/40 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="text-xs font-semibold text-blue-600">
                    Menampilkan {filteredPlaystations.length} dari{" "}
                    {playstations.length} paket
                  </div>
                </div>
                <div className="overflow-x-auto mt-6">
                  <table className="w-full text-sm">
                    <thead className="text-left text-slate-500 border-b">
                      <tr>
                        <th className="py-3 pr-4">Nama Paket</th>
                        <th className="py-3 pr-4">Tipe</th>
                        <th className="py-3 pr-4">Controller</th>
                        <th className="py-3 pr-4">Harga/Hari</th>
                        <th className="py-3 pr-4">Status</th>
                        <th className="py-3">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-700">
                      {filteredPlaystations.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-8 text-center text-sm text-slate-500"
                          >
                            Paket tidak ditemukan. Coba ubah kata kunci atau
                            filter.
                          </td>
                        </tr>
                      ) : (
                        filteredPlaystations.map(ps => (
                          <tr
                            key={ps.id}
                            className="border-b last:border-b-0 hover:bg-blue-50/40 transition"
                          >
                            <td className="py-4 pr-4">
                              <div className="font-semibold text-slate-900">
                                {ps.name}
                              </div>
                              <div className="text-xs text-slate-500">
                                {ps.version}
                              </div>
                            </td>
                            <td className="py-4 pr-4">{ps.type}</td>
                            <td className="py-4 pr-4">
                              {ps.controllers} unit
                            </td>
                            <td className="py-4 pr-4">
                              Rp {ps.pricePerDay.toLocaleString()}
                            </td>
                            <td className="py-4 pr-4">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  ps.status === "available"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}
                              >
                                {ps.status === "available"
                                  ? "Tersedia"
                                  : "Disewa"}
                              </span>
                            </td>
                            <td className="py-4">
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
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="bg-white rounded-2xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold text-slate-900">
                      {editingId ? "Edit Paket" : "Tambah Paket Baru"}
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">
                      Form ini adalah dummy UI untuk kebutuhan CRUD. Data akan
                      langsung tampil di tabel setelah disimpan.
                    </p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                    Form Paket
                  </span>
                </div>

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Nama Paket
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      placeholder="Contoh: Paket Elite"
                      className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Tipe PlayStation
                    </label>
                    <input
                      type="text"
                      name="type"
                      value={formState.type}
                      onChange={handleChange}
                      placeholder="PlayStation 5"
                      className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Versi / Storage
                    </label>
                    <input
                      type="text"
                      name="version"
                      value={formState.version}
                      onChange={handleChange}
                      placeholder="Digital Edition / 1TB"
                      className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Controller
                      </label>
                      <input
                        type="number"
                        name="controllers"
                        min="1"
                        value={formState.controllers}
                        onChange={handleChange}
                        className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-slate-700">
                        Harga / Hari
                      </label>
                      <input
                        type="number"
                        name="pricePerDay"
                        min="0"
                        value={formState.pricePerDay}
                        onChange={handleChange}
                        placeholder="80000"
                        className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-slate-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formState.status}
                      onChange={handleChange}
                      className="mt-2 w-full rounded-xl border border-blue-100 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">Tersedia</option>
                      <option value="rented">Disewa</option>
                    </select>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
                    >
                      {editingId ? "Simpan Perubahan" : "Tambah Paket"}
                    </button>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2 rounded-xl border border-blue-200 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Reset Form
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
