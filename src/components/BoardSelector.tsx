"use client";

import { useState, useEffect } from "react";

interface Board {
  id: string;
  name: string;
  description?: string;
  pin_count?: number;
}

interface BoardSelectorProps {
  value: string;
  onChange: (boardId: string, boardName: string) => void;
}

export default function BoardSelector({ value, onChange }: BoardSelectorProps) {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/boards");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch boards");
      }

      setBoards(data.boards || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load boards");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-rose-500" />
        <span className="text-sm text-gray-500">Loading boards…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-700">{error}</p>
            <button
              onClick={fetchBoards}
              className="mt-2 text-sm font-medium text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (boards.length === 0) {
    return (
      <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <svg className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126Z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-700">No boards found</p>
            <p className="mt-1 text-xs text-amber-600">
              Create a board on Pinterest first, then refresh this page.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => {
          const board = boards.find((b) => b.id === e.target.value);
          onChange(e.target.value, board?.name || "");
        }}
        className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 shadow-sm transition-colors focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
      >
        <option value="">Select a board…</option>
        {boards.map((board) => (
          <option key={board.id} value={board.id}>
            {board.name}
            {board.pin_count !== undefined ? ` (${board.pin_count} pins)` : ""}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}
