"use client";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-2 shadow-sm sm:p-3">
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
        placeholder="Search colleges by name, city, or course"
      />
    </div>
  );
}
