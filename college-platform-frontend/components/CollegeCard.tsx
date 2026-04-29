"use client";

import Link from "next/link";
import { useState } from "react";
import { api, getAuthHeaders } from "../lib/api";

interface CollegeCardProps {
  college: {
    id: number;
    name: string;
    location: string;
    fees: number;
    rating: number;
    placement: number;
    courses: string;
    exam: string;
    rank: number;
  };
}

const parseCourses = (courses: string): string[] => {
  try {
    return JSON.parse(courses);
  } catch {
    return [];
  }
};

export default function CollegeCard({ college }: CollegeCardProps) {
  const [status, setStatus] = useState<string>("");

  const handleSave = async () => {
    const headers = getAuthHeaders();
    if (!headers.Authorization) {
      setStatus("Login to save this college.");
      return;
    }

    try {
      await api.post(
        "/save",
        { collegeId: college.id },
        { headers }
      );
      setStatus("Saved successfully");
    } catch (error) {
      setStatus("Could not save college.");
    }
  };

  const courses = parseCourses(college.courses);

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">{college.name}</h2>
          <p className="mt-1 text-sm text-slate-500">{college.location}</p>
        </div>
        <div className="rounded-2xl bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">{college.rating.toFixed(1)}</div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p>Fees: <span className="font-semibold text-slate-900">₹{college.fees.toLocaleString()}</span></p>
        <p>Placement: <span className="font-semibold text-slate-900">{college.placement}%</span></p>
        <p>Exam: <span className="font-semibold text-slate-900">{college.exam}</span></p>
        <p>Cutoff Rank: <span className="font-semibold text-slate-900">{college.rank}</span></p>
        <p>Courses: {courses.slice(0, 2).join(", ")}</p>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Link href={`/college/${college.id}`} className="rounded-full border border-blue-600 px-4 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50">
          View details
        </Link>
        <button
          onClick={handleSave}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Save
        </button>
      </div>

      {status ? <p className="mt-3 text-sm text-blue-600">{status}</p> : null}
    </article>
  );
}
