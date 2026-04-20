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
              className="h-5 w-5 text-white fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0a12 12 0 0 0-4.373 23.178c-.105-.852-.202-2.158.04-3.088.204-.783 1.341-5.69 1.341-5.69s-.34-.68-.34-1.685c0-1.578.915-2.756 2.053-2.756.967 0 1.433.726 1.433 1.597 0 .974-.62 2.428-.94 3.776-.268 1.129.566 2.049 1.68 2.049 2.016 0 3.568-2.125 3.568-5.195 0-2.716-1.954-4.618-4.74-4.618-3.228 0-5.127 2.416-5.127 4.912 0 .973.373 2.02.839 2.587.09.108.102.203.07.313-.075.285-.246.906-.282 1.034-.043.149-.144.18-.328.106-1.22-.497-1.846-2.057-1.846-3.308 0-2.69 1.956-5.166 5.645-5.166 2.964 0 5.268 2.108 5.268 4.933 0 2.943-1.854 5.313-4.432 5.313-0.865 0-1.678-.45-1.957-.98l-.532 2.03c-.193.74-.714 1.673-1.06 2.239A12 12 0 1 0 12 0z" />
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
