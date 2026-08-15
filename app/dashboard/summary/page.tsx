"use client";

import { useEffect, useState } from "react";

type ScanResult = {
  repoName: string;
  score: number | null;
  summary: string;

  projectDescription?: string;

  technologies?: string[];

  strengths?: string[];

  improvements?: string[];

  checks: {
    README: "Passed" | "Warning";
    License: "Passed" | "Warning";
    "Recent activity": "Passed" | "Warning";
    Description: "Passed" | "Warning";
    "Open issues": "Passed" | "Warning";
    "Community health": "Passed" | "Warning";
  };
};

export default function ProjectSummary() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(true);

  /*
   * Read the latest repository scan from sessionStorage.
   *
   * IMPORTANT:
   * We only access sessionStorage inside useEffect.
   * This prevents Next.js hydration errors.
   */
  useEffect(() => {
    try {
      const savedScan = sessionStorage.getItem("reposheriff-scan");

      if (savedScan) {
        const parsed = JSON.parse(savedScan) as ScanResult;

        console.log("Summary loaded scan:", parsed);

        setScanResult(parsed);
      }
    } catch (error) {
      console.error("Failed to load repository scan:", error);

      sessionStorage.removeItem("reposheriff-scan");
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Loading state
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#111111] dark:bg-[#111111] dark:text-white">
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="text-center">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e9e2cf] border-t-[#ffc515]" />

            <p className="mt-5 text-lg text-[#6b685f] dark:text-gray-400">
              Loading project summary...
            </p>

          </div>
        </div>
      </main>
    );
  }

  /*
   * No repository scanned
   */
  if (!scanResult) {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-6 py-20 text-[#111111] dark:bg-[#111111] dark:text-white">

        <div className="mx-auto max-w-2xl">

          <div className="rounded-3xl border border-[#e9e2cf] bg-white p-10 text-center shadow-lg dark:border-gray-700 dark:bg-gray-900">

            <div className="text-5xl">
              🔒
            </div>

            <h1 className="mt-5 text-3xl font-bold">
              No Repository Scanned
            </h1>

            <p className="mt-4 leading-7 text-[#6b685f] dark:text-gray-300">
              Please scan a GitHub repository from the dashboard before
              viewing the project summary.
            </p>

            <a
              href="/dashboard"
              className="mt-7 inline-block rounded-xl bg-[#ffc515] px-6 py-3 font-semibold text-[#111111] transition hover:bg-[#edb500]"
            >
              ← Back to Dashboard
            </a>

          </div>

        </div>

      </main>
    );
  }

  /*
   * IMPORTANT:
   *
   * Everything below comes from the CURRENT scan.
   *
   * There is NO hardcoded RepoSheriff project information.
   */

  const technologies =
    scanResult.technologies &&
    scanResult.technologies.length > 0
      ? scanResult.technologies
      : ["Technology information unavailable"];

  const strengths =
    scanResult.strengths &&
    scanResult.strengths.length > 0
      ? scanResult.strengths
      : ["No specific strengths were provided by the analysis."];

  const improvements =
    scanResult.improvements &&
    scanResult.improvements.length > 0
      ? scanResult.improvements
      : ["No specific improvements were provided by the analysis."];

  const projectDescription =
    scanResult.projectDescription ||
    scanResult.summary ||
    "No project description was generated for this repository.";

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111] transition-colors duration-300 dark:bg-[#111111] dark:text-white">

      {/* =====================================================
          Navigation
      ====================================================== */}

      <nav className="border-b border-[#e9e2cf] bg-[#ffc515]">

        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

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

        {/* ===================================================
            Heading
        ==================================================== */}

        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-wider text-[#b28700]">
            Repository Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Project Summary
          </h1>

          <p className="mt-4 text-lg text-[#6b685f] dark:text-gray-300">
            Understanding{" "}
            <span className="font-semibold text-[#111111] dark:text-white">
              {scanResult.repoName}
            </span>
          </p>

        </div>

        {/* ===================================================
            Repository Overview
        ==================================================== */}

        <div className="rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-sm text-[#8b887e] dark:text-gray-400">
                Repository
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {scanResult.repoName}
              </h2>

            </div>

            <div className="rounded-2xl bg-[#fff3c4] px-6 py-4 text-center">

              <p className="text-xs font-medium text-[#9a7400]">
                Health Score
              </p>

              <p className="mt-1 text-3xl font-bold text-[#111111]">
                {scanResult.score ?? 0}/100
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            Project Description
        ==================================================== */}

        <section className="mt-8 rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3c4] text-2xl">
              📋
            </div>

            <div>

              <p className="text-sm font-medium text-[#8b887e] dark:text-gray-400">
                Overview
              </p>

              <h2 className="text-2xl font-bold">
                What is this project?
              </h2>

            </div>

          </div>

          {/* ACTUAL PROJECT DESCRIPTION */}

          <p className="mt-6 text-base leading-8 text-[#5f5b50] dark:text-gray-300">
            {projectDescription}
          </p>

          {/* AI SUMMARY */}

          <div className="mt-6 rounded-2xl border border-[#e9d99d] bg-[#fffdf5] p-6 dark:border-gray-700 dark:bg-gray-800">

            <p className="text-sm font-semibold text-[#9a7400]">
              AI Repository Summary
            </p>

            <p className="mt-2 leading-7 text-[#5f5b50] dark:text-gray-300">
              {scanResult.summary}
            </p>

          </div>

        </section>

        {/* ===================================================
            Technology Stack
        ==================================================== */}

        <section className="mt-8 rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3c4] text-2xl">
              🛠️
            </div>

            <div>

              <p className="text-sm font-medium text-[#8b887e] dark:text-gray-400">
                Technologies detected
              </p>

              <h2 className="text-2xl font-bold">
                Technology Stack
              </h2>

            </div>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            {technologies.map((technology, index) => (

              <span
                key={`${technology}-${index}`}
                className="rounded-xl border border-[#e9e2cf] bg-[#fffdf5] px-4 py-2 text-sm font-semibold text-[#4f4c45] dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                {technology}
              </span>

            ))}

          </div>

        </section>

        {/* ===================================================
            Strengths + Improvements
        ==================================================== */}

        <div className="mt-8 grid gap-8 md:grid-cols-2">

          {/* Strengths */}

          <section className="rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3c4] text-2xl">
                💪
              </div>

              <div>

                <p className="text-sm text-[#8b887e] dark:text-gray-400">
                  Positive Signals
                </p>

                <h2 className="text-2xl font-bold">
                  Project Strengths
                </h2>

              </div>

            </div>

            <div className="mt-6 space-y-3">

              {strengths.map((strength, index) => (

                <div
                  key={`${strength}-${index}`}
                  className="flex items-start gap-3 rounded-xl bg-[#fffdf5] p-4 dark:bg-gray-800"
                >

                  <span className="font-bold text-[#b28700]">
                    ✓
                  </span>

                  <p className="text-sm leading-6 text-[#5f5b50] dark:text-gray-300">
                    {strength}
                  </p>

                </div>

              ))}

            </div>

          </section>

          {/* Improvements */}

          <section className="rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff3c4] text-2xl">
                🔧
              </div>

              <div>

                <p className="text-sm text-[#8b887e] dark:text-gray-400">
                  Areas to Improve
                </p>

                <h2 className="text-2xl font-bold">
                  Potential Improvements
                </h2>

              </div>

            </div>

            <div className="mt-6 space-y-3">

              {improvements.map((improvement, index) => (

                <div
                  key={`${improvement}-${index}`}
                  className="flex items-start gap-3 rounded-xl bg-[#fffdf5] p-4 dark:bg-gray-800"
                >

                  <span className="font-bold text-[#b28700]">
                    →
                  </span>

                  <p className="text-sm leading-6 text-[#5f5b50] dark:text-gray-300">
                    {improvement}
                  </p>

                </div>

              ))}

            </div>

          </section>

        </div>

        {/* ===================================================
            Repository Snapshot
        ==================================================== */}

        <section className="mt-8 rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <p className="text-sm font-medium text-[#8b887e] dark:text-gray-400">
            Repository Signals
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            Project Snapshot
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            <Snapshot
              label="README"
              status={scanResult.checks.README}
            />

            <Snapshot
              label="License"
              status={scanResult.checks.License}
            />

            <Snapshot
              label="Recent Activity"
              status={scanResult.checks["Recent activity"]}
            />

            <Snapshot
              label="Description"
              status={scanResult.checks.Description}
            />

            <Snapshot
              label="Open Issues"
              status={scanResult.checks["Open issues"]}
            />

            <Snapshot
              label="Community Health"
              status={scanResult.checks["Community health"]}
            />

          </div>

        </section>

        {/* ===================================================
            Navigation
        ==================================================== */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">

          <a
            href="/dashboard/health"
            className="rounded-xl border border-[#e9e2cf] bg-white px-6 py-3 text-center font-semibold transition hover:bg-[#fff3c4] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            ← Repository Health
          </a>

          <a
            href="/dashboard/issues"
            className="rounded-xl bg-[#ffc515] px-6 py-3 text-center font-semibold text-[#111111]"
          >
            View Issue Suggestions →
          </a>

        </div>

      </section>

      {/* =====================================================
          Footer
      ====================================================== */}

      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">
        RepoSheriff — GitHub repository health & contributor intelligence
      </footer>

    </main>
  );
}

/* =========================================================
   Snapshot Component
========================================================= */

function Snapshot({
  label,
  status,
}: {
  label: string;
  status: "Passed" | "Warning";
}) {
  const isPassed = status === "Passed";

  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-4 dark:border-gray-700 dark:bg-gray-800">

      <span className="text-sm font-medium text-[#111111] dark:text-white">
        {label}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-semibold ${
          isPassed
            ? "bg-[#fff3c4] text-[#9a7400]"
            : "bg-[#fff0c0] text-[#9a7400]"
        }`}
      >
        {status}
      </span>

    </div>
  );
}