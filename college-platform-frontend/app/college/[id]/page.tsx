"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api, getAuthHeaders } from "../../../lib/api";
import Navbar from "../../../components/Navbar";

interface CollegeDetail {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  placement: number;
  courses: string;
  exam: string;
  rank: number;
}

const parseCourses = (courses: string): string[] => {
  try {
    return JSON.parse(courses);
  } catch {
    return [];
  }
};

export default function CollegeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const collegeId = params?.id;
  const [college, setCollege] = useState<CollegeDetail | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!collegeId) return;

    const fetchCollege = async () => {
      try {
        const response = await api.get(`/colleges/${collegeId}`);
        setCollege(response.data);
      } catch (error) {
        setStatus("College not available.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollege();
  }, [collegeId]);

  const handleSave = async () => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      setStatus("Login to save this college.");
      return;
    }

    try {
      await api.post("/save", { collegeId: Number(collegeId) }, { headers });
      setStatus("College saved successfully.");
    } catch (error) {
      setStatus("Unable to save this college.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-600">Loading college details…</main>
      </div>
    );
  }

  if (!college) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center text-slate-600">College not found.</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <button onClick={() => router.back()} className="mb-6 text-sm text-blue-600 hover:underline">
          ← Back to listing
        </button>

        <div className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-slate-900">{college.name}</h1>
              <p className="mt-2 text-slate-600">{college.location}</p>
            </div>
            <button
              onClick={handleSave}
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Save College
            </button>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
              <div className="mt-4 space-y-3 text-slate-600">
                <p><span className="font-semibold text-slate-900">Fees:</span> ₹{college.fees.toLocaleString()}</p>
                <p><span className="font-semibold text-slate-900">Placement:</span> {college.placement}%</p>
                <p><span className="font-semibold text-slate-900">Rating:</span> {college.rating.toFixed(1)}</p>
                <p><span className="font-semibold text-slate-900">Exam:</span> {college.exam}</p>
                <p><span className="font-semibold text-slate-900">Cutoff Rank:</span> {college.rank}</p>
              </div>
            </div>

            <div className="rounded-3xl bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900">Courses</h2>
              <ul className="mt-4 space-y-2 text-slate-600">
                {parseCourses(college.courses).map((course) => (
                  <li key={course} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    {course}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {status ? <p className="mt-6 rounded-3xl bg-blue-50 px-4 py-3 text-sm text-blue-700">{status}</p> : null}
        </div>
      </main>
    </div>
  );
}
