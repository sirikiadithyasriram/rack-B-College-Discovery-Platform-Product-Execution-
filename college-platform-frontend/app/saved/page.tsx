"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, getAuthHeaders } from "../../lib/api";
import Navbar from "../../components/Navbar";

interface SavedCollege {
  id: number;
  college: {
    id: number;
    name: string;
    location: string;
    fees: number;
    rating: number;
    placement: number;
  };
}

export default function SavedPage() {
  const router = useRouter();
  const [saved, setSaved] = useState<SavedCollege[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      const headers = getAuthHeaders();
      if (!headers.Authorization) {
        router.push("/login");
        return;
      }

      try {
        const response = await api.get("/save", { headers });
        setSaved(response.data);
      } catch {
        setMessage("Unable to load saved colleges.");
      }
    };

    fetchSaved();
  }, [router]);

  const removeSaved = async (id: number) => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) return;

    try {
      await api.delete(`/save/${id}`, { headers });
      setSaved((current) => current.filter((item) => item.id !== id));
    } catch {
      setMessage("Unable to remove saved college.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Saved colleges</h1>
          <p className="mt-2 text-slate-600">Your shortlisted colleges are saved here for quick access.</p>

          {message ? <p className="mt-4 text-sm text-red-600">{message}</p> : null}

          <div className="mt-6 space-y-4">
            {saved.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                No saved colleges yet.
              </div>
            ) : (
              saved.map((item) => (
                <div key={item.id} className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{item.college.name}</h2>
                    <p className="text-sm text-slate-600">{item.college.location}</p>
                    <p className="text-sm text-slate-600">Fees: ₹{item.college.fees.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => removeSaved(item.id)}
                    className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
