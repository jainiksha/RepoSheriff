"use client";

import { useEffect, useState } from "react";

type ScanResult = {
  repoName: string;
  score: number | null;
  summary: string;
  checks: {
    README: "Passed" | "Warning";
    License: "Passed" | "Warning";
    "Recent activity": "Passed" | "Warning";
    Description: "Passed" | "Warning";
    "Open issues": "Passed" | "Warning";
    "Community health": "Passed" | "Warning";
  };
};

export default function RepositoryHealth() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);

  /*
   * Read sessionStorage only after the browser has mounted.
   * This prevents the Next.js hydration mismatch.
   */
  useEffect(() => {
    setMounted(true);

    const savedScan = sessionStorage.getItem("reposheriff-scan");

    if (savedScan) {
      try {
        const parsed = JSON.parse(savedScan) as ScanResult;

        setScanResult(parsed);
      } catch (error) {
        console.error("Could not load repository data:", error);

        sessionStorage.removeItem("reposheriff-scan");
      }
    }

    setLoading(false);
  }, []);

  /*
   * Server and first client render show exactly the same UI.
   */
  if (!mounted || loading) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#111111] dark:bg-[#111111] dark:text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e9e2cf] border-t-[#ffc515]" />

            <p className="mt-5 text-sm text-[#6b685f] dark:text-gray-400">
              Loading repository health...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
   * No repository has been scanned.
   */
  if (!scanResult) {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-6 py-20 text-[#111111] dark:bg-[#111111] dark:text-white">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl border border-[#e9e2cf] bg-white p-10 shadow-lg dark:border-gray-700 dark:bg-gray-900">
            <div className="text-5xl">🔒</div>

            <h1 className="mt-5 text-3xl font-bold">
              No Repository Scanned
            </h1>

            <p className="mt-4 leading-7 text-[#6b685f] dark:text-gray-300">
              Please return to the dashboard and scan a GitHub repository
              before viewing its health report.
            </p>

            <a
              href="/dashboard"
              className="mt-7 inline-flex rounded-xl bg-[#ffc515] px-6 py-3 font-semibold text-[#111111] transition hover:bg-[#edb500]"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>
      </main>
    );
  }

  const score = scanResult.score ?? 0;

  const healthLabel =
    score >= 80
      ? "Healthy"
      : score >= 60
        ? "Needs Attention"
        : "At Risk";

  const healthDescription =
    score >= 80
      ? "Excellent repository health"
      : score >= 60
        ? "Repository needs some attention"
        : "Repository needs significant improvement";

  const passedChecks = Object.values(scanResult.checks).filter(
    (status) => status === "Passed"
  ).length;

  const totalChecks = Object.values(scanResult.checks).length;

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111] transition-colors duration-300 dark:bg-[#111111] dark:text-white">

      {/* =====================================================
          Header
      ====================================================== */}

      <nav className="border-b border-[#e9e2cf] bg-[#ffc515]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/reposheriff-logo.png"
              alt="RepoSheriff logo"
              className="h-14 w-24 object-contain"
            />

            <span className="text-xl font-bold tracking-tight text-[#111111]">
              RepoSheriff
            </span>
          </div>

          {/* Back button */}
          <a
            href="/dashboard"
            className="rounded-lg border border-[#111111] bg-[#111111] px-5 py-2 text-sm font-semibold text-[#ffc515] transition hover:bg-[#292923]"
          >
            ← Dashboard
          </a>

        </div>
      </nav>

      {/* =====================================================
          Main Content
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-16">

        {/* Page heading */}
        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-wider text-[#b28700]">
            Repository Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Repository Health
          </h1>

          <p className="mt-4 text-lg text-[#6b685f] dark:text-gray-300">
            Health analysis for{" "}
            <span className="font-semibold text-[#111111] dark:text-white">
              {scanResult.repoName}
            </span>
          </p>

        </div>

        {/* =====================================================
            Health Overview
        ====================================================== */}

        <section className="rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">

            {/* Score */}
            <div>
              <p className="text-sm text-[#8b887e] dark:text-gray-400">
                Health Score
              </p>

              <div className="mt-2 flex items-end gap-2">

                <span className="text-7xl font-bold text-[#111111] dark:text-white">
                  {score}
                </span>

                <span className="mb-3 text-[#8b887e] dark:text-gray-400">
                  / 100
                </span>

              </div>

              <div className="mt-5 h-3 w-full max-w-md overflow-hidden rounded-full bg-[#eee9dc] dark:bg-gray-700">

                <div
                  className="h-full rounded-full bg-[#ffc515] transition-all duration-700"
                  style={{
                    width: `${score}%`,
                  }}
                />

              </div>

            </div>

            {/* Status */}
            <div className="rounded-2xl bg-[#fff3c4] px-8 py-6 text-center">

              <p className="text-sm font-medium text-[#9a7400]">
                Repository Status
              </p>

              <p className="mt-2 text-2xl font-bold text-[#111111]">
                {healthLabel}
              </p>

            </div>

          </div>

          <p className="mt-6 text-base leading-7 text-[#b28700]">
            {healthDescription}
          </p>

          {scanResult.summary && (
            <div className="mt-6 rounded-2xl border border-[#e9d99d] bg-[#fffdf5] p-6 dark:border-gray-700 dark:bg-gray-800">

              <p className="text-sm font-semibold text-[#9a7400]">
                Repository Summary
              </p>

              <p className="mt-2 leading-7 text-[#5f5b50] dark:text-gray-300">
                {scanResult.summary}
              </p>

            </div>
          )}

        </section>

        {/* =====================================================
            Repository Checks
        ====================================================== */}

        <section className="mt-8 rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <p className="text-sm font-medium text-[#8b887e] dark:text-gray-400">
                Repository Signals
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Repository Checks
              </h2>
            </div>

            <div className="rounded-full bg-[#fff3c4] px-4 py-2 text-sm font-semibold text-[#9a7400]">
              {passedChecks}/{totalChecks} Passed
            </div>

          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2">

            <Check
              name="README"
              status={scanResult.checks.README}
            />

            <Check
              name="License"
              status={scanResult.checks.License}
            />

            <Check
              name="Recent Activity"
              status={scanResult.checks["Recent activity"]}
            />

            <Check
              name="Description"
              status={scanResult.checks.Description}
            />

            <Check
              name="Open Issues"
              status={scanResult.checks["Open issues"]}
            />

            <Check
              name="Community Health"
              status={scanResult.checks["Community health"]}
            />

          </div>

        </section>

        {/* =====================================================
            What This Means
        ====================================================== */}

        <section className="mt-8 rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <p className="text-sm font-medium text-[#8b887e] dark:text-gray-400">
            Analysis
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            What this means
          </h2>

          <div className="mt-6 grid gap-5 md:grid-cols-3">

            <InfoCard
              number="01"
              title="Repository Quality"
              description="The score reflects the overall quality and health signals detected in the repository."
            />

            <InfoCard
              number="02"
              title="Contributor Readiness"
              description="Repository checks help identify areas that may affect the contributor experience."
            />

            <InfoCard
              number="03"
              title="Next Steps"
              description="Use the Project Summary and Issue Suggestions sections to identify improvements and contribution opportunities."
            />

          </div>

        </section>

        {/* =====================================================
            Navigation
        ====================================================== */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">

          <a
            href="/dashboard"
            className="rounded-xl border border-[#e9e2cf] bg-white px-6 py-3 text-center font-semibold transition hover:bg-[#fff3c4] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            ← Dashboard
          </a>

          <div className="flex flex-col gap-4 sm:flex-row">

            <a
              href="/dashboard/summary"
              className="rounded-xl border border-[#e9e2cf] bg-white px-6 py-3 text-center font-semibold transition hover:bg-[#fff3c4] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            >
              Project Summary
            </a>

            <a
              href="/dashboard/issues"
              className="rounded-xl bg-[#ffc515] px-6 py-3 text-center font-semibold text-[#111111] transition hover:bg-[#edb500]"
            >
              Issue Suggestions →
            </a>

          </div>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">
        RepoSheriff — GitHub repository health & contributor intelligence
      </footer>

    </main>
  );
}

/* =========================================================
   Check Component
========================================================= */

function Check({
  name,
  status,
}: {
  name: string;
  status: "Passed" | "Warning";
}) {
  const passed = status === "Passed";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5 dark:border-gray-700 dark:bg-gray-800">

      <span className="text-sm font-medium text-[#111111] dark:text-white">
        {name}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          passed
            ? "bg-[#fff3c4] text-[#9a7400]"
            : "bg-[#fff0c0] text-[#9a7400]"
        }`}
      >
        {status}
      </span>

    </div>
  );
}

/* =========================================================
   Info Card
========================================================= */

function InfoCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 dark:border-gray-700 dark:bg-gray-800">

      <span className="text-sm font-semibold text-[#b28700]">
        {number}
      </span>

      <h3 className="mt-4 text-lg font-bold text-[#111111] dark:text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-[#6b685f] dark:text-gray-300">
        {description}
      </p>

    </div>
  );
}