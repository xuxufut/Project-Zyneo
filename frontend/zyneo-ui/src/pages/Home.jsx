import { useEffect, useState } from "react";
import api from "../services/api";
import PlaystationCard from "../components/PlaystationCard";

export default function Home() {
  const [playstations, setPlaystations] = useState([]);

  useEffect(() => {
    api.get("/playstations")
      .then(res => setPlaystations(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">
          🎮 Sewa Playstation Tanpa Ribet
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {playstations.map(ps => (
            <PlaystationCard key={ps.id} ps={ps} />
          ))}
        </div>
      </div>
    </div>
  );
}
