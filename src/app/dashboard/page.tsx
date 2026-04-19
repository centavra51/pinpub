"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "@/components/SessionProvider";

interface Board {
  id: string;
  name: string;
  description?: string;
  pin_count?: number;
}

export default function DashboardPage() {
  const { connected, loading, username, disconnect } = useSession();
  const [boards, setBoards] = useState<Board[]>([]);
  const [boardsLoading, setBoardsLoading] = useState(false);
  const [boardsError, setBoardsError] = useState<string | null>(null);

  useEffect(() => {
    if (connected) {
      fetchBoards();
    }
  }, [connected]);

  const fetchBoards = async () => {
    setBoardsLoading(true);
    setBoardsError(null);
    try {
      const res = await fetch("/api/boards");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBoards(data.boards || []);
    } catch (err) {
      setBoardsError(
        err instanceof Error ? err.message : "Failed to load boards"
      );
    } finally {
      setBoardsLoading(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
    setBoards([]);
  };

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-rose-500" />
          <p className="text-sm text-gray-500">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  // Not connected state
  if (!connected) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <div className="inline-flex rounded-2xl bg-gray-50 p-4 mb-6">
            <svg className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-3.061a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            Connect your Pinterest account
          </h2>
          <p className="mt-3 text-gray-500 max-w-md mx-auto">
            Link your own Pinterest account to get started. You'll be able to
            select boards and manually publish your original Pins.
          </p>
          <a
            href="/api/auth/connect"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-0.5 transition-all"
          >
            Connect Pinterest
          </a>
        </div>
      </div>
    );
  }

  // Connected dashboard
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Pinterest connection and publish Pins
          </p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Create New Pin
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Connection status card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Connected
              </h2>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center shadow-sm">
                <span className="text-lg font-bold text-white uppercase">
                  {username ? username[0] : "U"}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  @{username || "user"}
                </p>
                <p className="text-xs text-gray-400">Pinterest Account</p>
              </div>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              Disconnect account
            </button>
          </div>

          {/* Compliance note */}
          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-5">
            <div className="flex gap-3">
              <svg className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <p className="text-xs text-emerald-700 leading-relaxed">
                This app is designed for manual publication of original content
                to your own Pinterest boards. Each Pin is published only after
                explicit user confirmation.
              </p>
            </div>
          </div>
        </div>

        {/* Boards list */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-gray-900">
                Your Boards
              </h2>
              {!boardsLoading && (
                <button
                  onClick={fetchBoards}
                  className="text-sm font-medium text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Refresh
                </button>
              )}
            </div>

            {boardsLoading ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-rose-500" />
                <p className="text-sm text-gray-400">Loading boards…</p>
              </div>
            ) : boardsError ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-5 text-center">
                <p className="text-sm text-red-600">{boardsError}</p>
                <button
                  onClick={fetchBoards}
                  className="mt-3 text-sm font-medium text-red-500 underline hover:text-red-600"
                >
                  Try again
                </button>
              </div>
            ) : boards.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex rounded-2xl bg-gray-50 p-4 mb-4">
                  <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700">
                  No boards found
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Create a board on Pinterest first, then refresh.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {boards.map((board) => (
                  <Link
                    key={board.id}
                    href={`/create?boardId=${board.id}&boardName=${encodeURIComponent(board.name)}`}
                    className="group flex items-center gap-4 rounded-xl border border-gray-100 p-4 hover:border-rose-200 hover:bg-rose-50/30 transition-all"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-rose-100 transition-colors">
                      <svg className="h-5 w-5 text-gray-400 group-hover:text-rose-500 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6Z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {board.name}
                      </p>
                      {board.pin_count !== undefined && (
                        <p className="text-xs text-gray-400">
                          {board.pin_count} pin{board.pin_count !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <svg className="h-4 w-4 text-gray-300 group-hover:text-rose-400 transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
