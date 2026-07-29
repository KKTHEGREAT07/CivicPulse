import { useEffect, useState } from "react";
import API from "../../../services/api";
import type { Resident } from "../../../types/user";

function ResidentsSection() {
  const [residents, setResidents] = useState<Resident[]>([]);

  useEffect(() => {
    API.get("/society/residents").then((res) => setResidents(res.data));
  }, []);

  const handleUpdate = async (id: string, newValue: Resident['role']) => {
    const original = residents.find((r) => r._id === id);
    
    if (original && original.role !== newValue) {
      try {
        await API.put(`/society/residents/${id}`, { role: newValue });
        setResidents((prev) =>
          prev.map((r) => (r._id === id ? { ...r, role: newValue } : r))
        );
      } catch (err) {
        console.error("Failed to update resident", err);
      }
    }
  };

  const removeResident = async (id: string) => {
    if (!confirm("Remove resident?")) return;
    await API.delete(`/society/residents/${id}`);
    setResidents((prev) => prev.filter((r) => r._id !== id));
  };

  if(residents.length===0)return <p className="text-slate-500 dark:text-slate-400">Loading...</p>

  return (
    <div className="space-y-4">
      {residents.map((r) => {

        return (
          <div key={r._id} className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-slate-200/60 dark:border-slate-700">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{r.name}</span>

            <select
              value={r.role}
              className="border border-slate-300 dark:border-slate-600 bg-transparent rounded-lg p-2 text-slate-700 dark:text-slate-300 outline-none focus:border-sky-500 dark:focus:border-sky-400"
              onChange={(e) => handleUpdate(r._id, e.target.value as any)}
            >
              <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="resident">Resident</option>
              <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="member">Member</option>
              <option className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white" value="admin">Admin</option>
            </select>

            <button onClick={() => removeResident(r._id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:underline text-sm font-semibold transition-colors">
              Remove
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ResidentsSection;