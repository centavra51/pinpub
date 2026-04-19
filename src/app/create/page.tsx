"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "@/components/SessionProvider";
import ImageUpload from "@/components/ImageUpload";
import BoardSelector from "@/components/BoardSelector";

interface PublishResult {
  success: boolean;
  pin: {
    id: string;
    title?: string;
    description?: string;
    link?: string;
    board_id?: string;
    created_at?: string;
  };
  publishedAt: string;
}

function CreatePinForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { connected, loading: sessionLoading } = useSession();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [boardId, setBoardId] = useState(searchParams.get("boardId") || "");
  const [boardName, setBoardName] = useState(
    searchParams.get("boardName") || ""
  );
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [contentType, setContentType] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // UI state
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PublishResult | null>(null);
  const [showRawResponse, setShowRawResponse] = useState(false);

  // Validation
  const [linkError, setLinkError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionLoading && !connected) {
      router.push("/dashboard");
    }
  }, [connected, sessionLoading, router]);

  const validateLink = (url: string) => {
    if (!url.trim()) {
      setLinkError(null);
      return true;
    }
    try {
      new URL(url);
      setLinkError(null);
      return true;
    } catch {
      setLinkError("Please enter a valid URL (e.g., https://example.com)");
      return false;
    }
  };

  const canPublish =
    title.trim().length > 0 &&
    boardId &&
    imageBase64 &&
    confirmed &&
    !linkError;

  const handlePublish = async () => {
    if (!canPublish || publishing) return;

    if (!validateLink(link)) return;

    setPublishing(true);
    setError(null);

    try {
      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          boardId,
          link: link.trim() || undefined,
          imageBase64,
          contentType,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to publish Pin");
      }

      setResult({ ...data, boardName });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPublishing(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setBoardId("");
    setBoardName("");
    setImageBase64(null);
    setContentType(null);
    setImagePreview(null);
    setConfirmed(false);
    setError(null);
    setResult(null);
    setShowRawResponse(false);
  };

  if (sessionLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-rose-500" />
      </div>
    );
  }

  // ─── Success State ──────────────────────────────────────────────────────────

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-10 shadow-sm animate-fade-in-up">
          {/* Success icon */}
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-emerald-50 p-4">
              <svg className="h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
          </div>

          {/* Success message */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Pin published successfully!
            </h2>
            <p className="mt-2 text-gray-500">
              Your Pin has been posted to Pinterest.
            </p>
          </div>

          {/* Details */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-5 mb-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Publication details
            </h3>
            <dl className="space-y-2.5">
              {result.pin.title && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Title</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {result.pin.title}
                  </dd>
                </div>
              )}
              {boardName && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Board</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {boardName}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Published at</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {new Date(result.publishedAt).toLocaleString()}
                </dd>
              </div>
              {result.pin.id && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Pin ID</dt>
                  <dd className="text-sm font-mono text-gray-600">
                    {result.pin.id}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* View on Pinterest */}
          {result.pin.id && (
            <a
              href={`https://www.pinterest.com/pin/${result.pin.id}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors mb-3"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
              </svg>
              View on Pinterest
            </a>
          )}

          {/* Raw response toggle */}
          <button
            onClick={() => setShowRawResponse(!showRawResponse)}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mb-3"
          >
            <svg
              className={`h-3 w-3 transition-transform ${showRawResponse ? "rotate-90" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            {showRawResponse ? "Hide" : "Show"} API response
          </button>

          {showRawResponse && (
            <pre className="rounded-xl bg-gray-900 text-gray-300 p-4 text-xs overflow-x-auto mb-6">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
            >
              Publish another Pin
            </button>
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Create Pin Form ────────────────────────────────────────────────────────

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      {/* Page header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Back to dashboard
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          Create a new Pin
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload your original content and publish it to your selected board.
        </p>
      </div>

      <div className="space-y-6">
        {/* Image upload */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            Pin Image <span className="text-rose-500">*</span>
          </label>
          <ImageUpload
            onImageSelect={(base64, type, preview) => {
              setImageBase64(base64);
              setContentType(type);
              setImagePreview(preview);
            }}
            preview={imagePreview}
            onClear={() => {
              setImageBase64(null);
              setContentType(null);
              setImagePreview(null);
            }}
          />
        </div>

        {/* Pin details */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
          {/* Title */}
          <div>
            <label
              htmlFor="pin-title"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Pin Title <span className="text-rose-500">*</span>
            </label>
            <input
              id="pin-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a descriptive title for your Pin"
              maxLength={100}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
            <p className="mt-1.5 text-xs text-gray-400 text-right">
              {title.length}/100
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="pin-description"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Description
            </label>
            <textarea
              id="pin-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for your Pin"
              rows={3}
              maxLength={500}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm resize-none focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100"
            />
            <p className="mt-1.5 text-xs text-gray-400 text-right">
              {description.length}/500
            </p>
          </div>

          {/* Destination URL */}
          <div>
            <label
              htmlFor="pin-link"
              className="block text-sm font-semibold text-gray-900 mb-2"
            >
              Destination URL
            </label>
            <input
              id="pin-link"
              type="url"
              value={link}
              onChange={(e) => {
                setLink(e.target.value);
                if (linkError) validateLink(e.target.value);
              }}
              onBlur={() => validateLink(link)}
              placeholder="https://example.com"
              className={`w-full rounded-xl border ${
                linkError ? "border-red-300" : "border-gray-200"
              } bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100`}
            />
            {linkError && (
              <p className="mt-1.5 text-xs text-red-500">{linkError}</p>
            )}
          </div>

          {/* Board selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Board <span className="text-rose-500">*</span>
            </label>
            <BoardSelector
              value={boardId}
              onChange={(id, name) => {
                setBoardId(id);
                setBoardName(name);
              }}
            />
          </div>
        </div>

        {/* Confirmation & publish */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          {/* Content rights confirmation */}
          <label className="flex items-start gap-3 cursor-pointer mb-6">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-rose-500 focus:ring-rose-400"
            />
            <span className="text-sm text-gray-600 leading-relaxed">
              I confirm this content is mine or I have the right to publish it.
              I understand this Pin will be published to my Pinterest board.
            </span>
          </label>

          {/* Publishing notice */}
          <div className="flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-3 mb-6">
            <svg className="h-4 w-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
            <p className="text-xs text-blue-600">
              Each Pin is published only after explicit user confirmation.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 mb-6">
              <svg className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Publish button */}
          <button
            onClick={handlePublish}
            disabled={!canPublish || publishing}
            className={`w-full rounded-xl px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-all ${
              canPublish && !publishing
                ? "bg-gradient-to-r from-rose-500 to-red-600 hover:shadow-md hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            {publishing ? (
              <span className="inline-flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Publishing…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                Publish Pin
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreatePinPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-rose-500" />
        </div>
      }
    >
      <CreatePinForm />
    </Suspense>
  );
}
