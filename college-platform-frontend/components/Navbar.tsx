"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setIsAuthenticated(Boolean(localStorage.getItem("token")));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/login");
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-slate-900">
          College Platform
        </Link>

        <nav className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <Link className={pathname === "/" ? "text-slate-900" : "hover:text-slate-900"} href="/">
            Colleges
          </Link>
          <Link className={pathname === "/compare" ? "text-slate-900" : "hover:text-slate-900"} href="/compare">
            Compare
          </Link>
          <Link className={pathname === "/saved" ? "text-slate-900" : "hover:text-slate-900"} href="/saved">
            Saved
          </Link>
          {isAuthenticated ? (
            <button onClick={handleLogout} className="rounded-lg bg-slate-900 px-4 py-2 text-white hover:bg-slate-800">
              Logout
            </button>
          ) : (
            <Link href="/login" className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
