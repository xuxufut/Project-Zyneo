export default function PlaystationCard({ ps }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-xl font-semibold">{ps.name}</h2>
      <p className="text-gray-500">{ps.type}</p>

      <div className="mt-4 flex justify-between items-center">
        <span className="font-bold">
          Rp {ps.price_per_day.toLocaleString()}/hari
        </span>

        <span
          className={`px-3 py-1 rounded-full text-sm ${
            ps.status === "available"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {ps.status}
        </span>
      </div>
    </div>
  );
}
