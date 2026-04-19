"use client";

import Link from "next/link";
import { useSession } from "./SessionProvider";

export default function Header() {
  const { connected, username } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-red-600 shadow-sm group-hover:shadow-md transition-shadow">
            <svg
              className="h-5 w-5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
          </div>
          <span className="text-lg font-semibold text-gray-900 tracking-tight">
            Pin Publisher <span className="text-rose-500">Lite</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          {connected ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2"
              >
                Dashboard
              </Link>
              <Link
                href="/create"
                className="inline-flex items-center gap-1.5 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-600 transition-colors"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Create Pin
              </Link>
              <div className="ml-1 flex items-center gap-2 rounded-full border border-gray-200 py-1.5 pl-1.5 pr-3">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center">
                  <span className="text-xs font-bold text-white uppercase">
                    {username ? username[0] : "U"}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {username || "Connected"}
                </span>
              </div>
            </>
          ) : (
            <Link
              href="/api/auth/connect"
              className="inline-flex items-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-rose-600 transition-colors"
            >
              Connect Pinterest
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
