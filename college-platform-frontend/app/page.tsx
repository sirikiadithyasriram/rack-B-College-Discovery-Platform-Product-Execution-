"use client";

import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import CollegeCard from "../components/CollegeCard";

interface College {
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

export default function Home() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [examFilter, setExamFilter] = useState("");
  const [maxRankFilter, setMaxRankFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const resetPage = () => setPage(1);

  useEffect(() => {
    const fetchColleges = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await api.get("/colleges", {
          params: {
            search: search.trim() || undefined,
            location: locationFilter || undefined,
            exam: examFilter || undefined,
            maxRank: maxRankFilter || undefined,
            page,
          },
        });
        setColleges(response.data);
      } catch (err) {
        setError("Unable to load colleges. Please check the backend.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchColleges();
  }, [search, locationFilter, examFilter, maxRankFilter, page]);

  const locations = useMemo(() => {
    return Array.from(
      new Set(colleges.map((college) => college.location))
    ).sort();
  }, [colleges]);

  const exams = useMemo(() => {
    return Array.from(
      new Set(colleges.map((college) => college.exam))
    ).sort();
  }, [colleges]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Colleges</p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">Find your ideal college</h1>
            <p className="mt-2 text-slate-600">Search, filter and compare top institutes with a clean minimal interface.</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_auto]">
            <SearchBar
              value={search}
              onChange={(value) => {
                setSearch(value);
                resetPage();
              }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
              <select
                value={locationFilter}
                onChange={(event) => {
                  setLocationFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">All locations</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <select
                value={examFilter}
                onChange={(event) => {
                  setExamFilter(event.target.value);
                  setPage(1);
                }}
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">All exams</option>
                {exams.map((exam) => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
              <input
                type="number"
                value={maxRankFilter}
                onChange={(event) => {
                  setMaxRankFilter(event.target.value);
                  setPage(1);
                }}
                placeholder="Max rank cutoff"
                className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading ? (
            <div className="col-span-full rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">Loading colleges…</div>
          ) : colleges.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
              No colleges found.
            </div>
          ) : (
            colleges.map((college) => <CollegeCard key={college.id} college={college} />)
          )}
        </section>

        <div className="mt-8 flex items-center justify-between rounded-3xl bg-white px-5 py-4 shadow-sm">
          <button
            onClick={() => setPage((current) => Math.max(current - 1, 1))}
            disabled={page === 1}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-slate-600">Page {page}</span>
          <button
            onClick={() => setPage((current) => current + 1)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:border-slate-300"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
}
