"use client";

import { useState } from "react";

type CheckResult = {
  name: string;
  status: "Passed" | "Warning";
  message: string;
};

type ScanResult = {
  success: boolean;
  repository: {
    name: string;
    fullName: string;
    description: string | null;
    stars: number;
    forks: number;
    openIssues: number;
    language: string | null;
    defaultBranch: string;
    url: string;
  };
  health: {
    score: number;
    status: string;
    checks: CheckResult[];
  };
};

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!repoUrl.trim()) {
      setError("Please enter a GitHub repository URL.");
      return;
    }

    setLoading(true);
    setError("");
    setScanResult(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: repoUrl.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to scan repository.");
      }

      setScanResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while scanning."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#08090b] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap 0.1">
            <img
              src="/reposheriff-logo.png"
              alt="RepoSheriff logo"
              className="h-20 w-35 object-contain"
            />

            <span className="text-xl font-bold tracking-tight">
              RepoSheriff
            </span>
          </div>

          <div className="hidden gap-8 text-sm text-gray-400 md:flex">
            <span className="cursor-pointer hover:text-white">
              How it works
            </span>
            <span className="cursor-pointer hover:text-white">
              Features
            </span>
            <span className="cursor-pointer hover:text-white">About</span>
          </div>

          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-white/15 px-4 py-2 text-sm text-gray-300 hover:bg-white/5"
          >
            GitHub
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Open-source repository intelligence
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Know the health of
            <span className="text-emerald-400"> any repo.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-400">
            RepoSheriff analyzes GitHub repositories, scores their health,
            finds problems, and tells contributors exactly what to improve.
          </p>

          {/* Scanner */}
          <div className="mx-auto mt-10 max-w-2xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 shadow-2xl md:flex-row">
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleScan();
                  }
                }}
                placeholder="https://github.com/owner/repository"
                className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-white outline-none placeholder:text-gray-600"
              />

              <button
                onClick={handleScan}
                disabled={loading}
                className="rounded-xl bg-emerald-400 px-7 py-3 font-semibold text-black transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Scanning..." : "Scan Repository"}
              </button>
            </div>

            {error && (
              <p className="mt-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <p className="mt-3 text-xs text-gray-600">
              No GitHub installation required. Paste a public repository URL.
            </p>
          </div>
        </div>
      </section>

      {/* Dynamic Scan Result */}
      {scanResult && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f12]">
            {/* Repository Header */}
            <div className="flex flex-col gap-5 border-b border-white/10 px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Repository information
                </p>

                <h2 className="mt-1 text-2xl font-semibold">
                  {scanResult.repository.fullName}
                </h2>

                <p className="mt-2 text-gray-400">
                  {scanResult.repository.description ||
                    "No repository description available."}
                </p>
              </div>

              <a
                href={scanResult.repository.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-white/15 px-5 py-3 text-sm text-gray-300 hover:bg-white/5"
              >
                View on GitHub
              </a>
            </div>

            {/* Repository Stats */}
            <div className="grid gap-4 border-b border-white/10 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <Stat
                label="Stars"
                value={scanResult.repository.stars}
              />

              <Stat
                label="Forks"
                value={scanResult.repository.forks}
              />

              <Stat
                label="Open Issues"
                value={scanResult.repository.openIssues}
              />

              <Stat
                label="Language"
                value={scanResult.repository.language || "Unknown"}
              />
            </div>

            {/* Health Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-sm text-gray-500">
                  Repository health
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  {scanResult.repository.fullName}
                </h2>
              </div>

              <div
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  scanResult.health.status === "Healthy"
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-yellow-400/10 text-yellow-400"
                }`}
              >
                {scanResult.health.status}
              </div>
            </div>

            {/* Health Score + Checks */}
            <div className="grid gap-6 p-6 md:grid-cols-3">
              {/* Score */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <p className="text-sm text-gray-500">
                  Health Score
                </p>

                <div className="mt-4 flex items-end gap-2">
                  <span className="text-6xl font-bold">
                    {scanResult.health.score}
                  </span>

                  <span className="mb-2 text-gray-500">
                    / 100
                  </span>
                </div>

                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-400 transition-all"
                    style={{
                      width: `${scanResult.health.score}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-sm text-emerald-400">
                  {scanResult.health.status} repository health
                </p>
              </div>

              {/* Checks */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:col-span-2">
                <p className="mb-4 text-sm text-gray-500">
                  Repository checks
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {scanResult.health.checks.map((check) => (
                    <Check
                      key={check.name}
                      name={check.name}
                      status={check.status}
                      message={check.message}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Branch */}
            <div className="border-t border-white/10 px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Default Branch
                </span>

                <span className="rounded-full bg-emerald-400/10 px-4 py-2 text-sm text-emerald-400">
                  {scanResult.repository.defaultBranch}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Static Preview when nothing has been scanned */}
      {!scanResult && (
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#0d0f12]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <p className="text-sm text-gray-500">
                  Repository health preview
                </p>

                <h2 className="mt-1 text-xl font-semibold">
                  Scan a repository to see its health
                </h2>
              </div>

              <div className="rounded-full bg-white/5 px-4 py-2 text-sm text-gray-500">
                Waiting
              </div>
            </div>

            <div className="grid gap-6 p-6 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:col-span-1">
                <p className="text-sm text-gray-500">
                  Health Score
                </p>

                <div className="mt-4">
                  <span className="text-5xl font-bold text-gray-700">
                    --
                  </span>

                  <span className="ml-2 text-gray-600">
                    / 100
                  </span>
                </div>

                <div className="mt-5 h-2 rounded-full bg-white/5" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:col-span-2">
                <p className="mb-4 text-sm text-gray-500">
                  Repository checks
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  <PreviewCheck name="README" />
                  <PreviewCheck name="License" />
                  <PreviewCheck name="Recent activity" />
                  <PreviewCheck name="Description" />
                  <PreviewCheck name="Open issues" />
                  <PreviewCheck name="Community health" />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-12 max-w-2xl">
            <p className="text-sm font-medium text-emerald-400">
              WHAT REPOSHERIFF DOES
            </p>

            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              From GitHub repository to actionable report.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Feature
              number="01"
              title="Health Score"
              description="Get a clear score out of 100 based on repository quality and activity."
            />

            <Feature
              number="02"
              title="Find Problems"
              description="Discover missing documentation, stale issues, weak contributor practices, and more."
            />

            <Feature
              number="03"
              title="Improve Faster"
              description="Get plain-English suggestions explaining exactly what maintainers should fix."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 text-center text-sm text-gray-600">
        RepoSheriff — GitHub repository health & contributor intelligence
      </footer>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="text-sm text-gray-500">{label}</p>

      <p className="mt-4 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

function Check({
  name,
  status,
  message,
}: {
  name: string;
  status: "Passed" | "Warning";
  message: string;
}) {
  const passed = status === "Passed";

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-gray-300">
          {name}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            passed
              ? "bg-emerald-400/10 text-emerald-400"
              : "bg-yellow-400/10 text-yellow-400"
          }`}
        >
          {status}
        </span>
      </div>

      <p className="mt-2 text-xs leading-5 text-gray-500">
        {message}
      </p>
    </div>
  );
}

function PreviewCheck({ name }: { name: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
      <span className="text-sm text-gray-600">
        {name}
      </span>

      <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-gray-700">
        --
      </span>
    </div>
  );
}

function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <span className="text-sm text-emerald-400">
        {number}
      </span>

      <h3 className="mt-5 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-500">
        {description}
      </p>
    </div>
  );
}