"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Navbar from "../../components/Navbar";

interface College {
  id: number;
  name: string;
  fees: number;
  rating: number;
  placement: number;
}

export default function ComparePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [result, setResult] = useState<College[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get("/colleges", { params: { page: 1 } });
        setColleges(response.data);
      } catch {
        setError("Unable to load colleges for comparison.");
      }
    };
    load();
  }, []);

  const toggleCollege = (id: number) => {
    setResult([]);
    setError("");

    setSelected((curr) => {
      if (curr.includes(id)) {
        return curr.filter((item) => item !== id);
      }
      if (curr.length >= 3) {
        return curr;
      }
      return [...curr, id];
    });
  };

  const handleCompare = async () => {
    if (selected.length < 2) {
      setError("Select at least two colleges to compare.");
      return;
    }

    try {
      const response = await api.post("/colleges/compare", { ids: selected });
      setResult(response.data);
    } catch {
      setError("Comparison request failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Compare colleges</h1>
          <p className="mt-2 text-slate-600">Choose up to 3 colleges and compare fees, placement, and rating.</p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {colleges.map((college) => (
              <label
                key={college.id}
                className={`cursor-pointer rounded-3xl border p-4 transition ${selected.includes(college.id) ? "border-blue-600 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(college.id)}
                  onChange={() => toggleCollege(college.id)}
                  className="mr-3 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-base font-semibold text-slate-900">{college.name}</span>
                <p className="mt-2 text-sm text-slate-600">Fees: ₹{college.fees.toLocaleString()}</p>
                <p className="text-sm text-slate-600">Placement: {college.placement}%</p>
              </label>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={handleCompare}
              className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Compare selected
            </button>
            <p className="text-sm text-slate-500">Selected {selected.length} / 3 colleges</p>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          {result.length > 0 ? (
            <div className="mt-8 overflow-x-auto rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <table className="min-w-full text-left text-sm text-slate-700">
                <thead>
                  <tr>
                    <th className="px-4 py-3">College</th>
                    <th className="px-4 py-3">Fees</th>
                    <th className="px-4 py-3">Placement</th>
                    <th className="px-4 py-3">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {result.map((college) => (
                    <tr key={college.id} className="border-t border-slate-200">
                      <td className="px-4 py-3 font-semibold text-slate-900">{college.name}</td>
                      <td className="px-4 py-3">₹{college.fees.toLocaleString()}</td>
                      <td className="px-4 py-3">{college.placement}%</td>
                      <td className="px-4 py-3">{college.rating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
