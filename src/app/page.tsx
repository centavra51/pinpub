"use client";

import Link from "next/link";
import { useSession } from "@/components/SessionProvider";

const steps = [
  {
    number: "01",
    title: "Connect Account",
    description: "Link your own Pinterest account securely via OAuth",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-3.061a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Choose Board",
    description: "Select which of your boards to publish to",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Upload Content",
    description: "Upload your own original image for the Pin",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Publish Manually",
    description: "Review and confirm before each Pin is published",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
      </svg>
    ),
  },
];

export default function HomePage() {
  const { connected, loading } = useSession();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-rose-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative mx-auto max-w-5xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
          <div className="text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-1.5 mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse-dot" />
              <span className="text-xs font-medium text-rose-600">
                Manual Pinterest Publishing
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Publish your original Pins
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-red-600">
                with confidence
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500 leading-relaxed">
              A simple tool to manually publish your original Pins to Pinterest.
              Your content, your boards, your workflow.
            </p>

            {/* CTA */}
            <div className="mt-10 flex justify-center gap-4">
              {loading ? (
                <div className="h-12 w-48 rounded-xl bg-gray-100 animate-pulse" />
              ) : connected ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-0.5 transition-all"
                >
                  Go to Dashboard
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              ) : (
                <a
                  href="/api/auth/connect"
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-200 hover:-translate-y-0.5 transition-all"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-3.061a4.5 4.5 0 0 0-1.242-7.244l4.5-4.5a4.5 4.5 0 0 1 6.364 6.364l-1.757 1.757" />
                  </svg>
                  Connect Pinterest
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-4 pb-24 sm:px-6">
        <div className="text-center mb-14 animate-fade-in-up-delay-1">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            How it works
          </h2>
          <p className="mt-3 text-gray-500">
            Four simple steps to publish your Pin
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in-up-delay-2">
          {steps.map((step) => (
            <div
              key={step.number}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md hover:border-gray-200 transition-all"
            >
              {/* Step number */}
              <span className="text-xs font-bold text-gray-200 tracking-widest">
                {step.number}
              </span>

              {/* Icon */}
              <div className="mt-4 inline-flex rounded-xl bg-rose-50 p-3 text-rose-500 group-hover:bg-rose-100 transition-colors">
                {step.icon}
              </div>

              {/* Content */}
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust banner */}
      <section className="border-t border-gray-100 bg-gray-50/50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 animate-fade-in-up-delay-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 sm:p-10">
            <div className="flex flex-col items-center text-center gap-4">
              <div className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-500">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Built for compliance and transparency
              </h3>
              <p className="max-w-lg text-sm text-gray-500 leading-relaxed">
                This application is designed for manual, user-initiated
                publication of original content. No bulk posting, no scraping,
                no automated engagement — just a clean way to share your
                creative work on Pinterest.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
