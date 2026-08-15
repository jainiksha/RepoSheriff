"use client";

import { useState } from "react";
import ThemeToggle from "@/components/ThemeToggle";

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

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = async () => {
    if (!repoUrl.trim()) return;

    setIsScanning(true);

    try {
      const cleanUrl = repoUrl.trim();

      const res = await fetch("/api/wizard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `
Analyze this GitHub repository: ${cleanUrl}

Return your answer in exactly this JSON format:

{
  "repoName": "owner/repository",
  "score": 85,
  "summary": "Short explanation of repository health",
  "checks": {
    "README": "Passed",
    "License": "Passed",
    "Recent activity": "Passed",
    "Description": "Passed",
    "Open issues": "Warning",
    "Community health": "Passed"
  }
}

Rules:
- score must be a number from 0 to 100.
- Each check must be exactly "Passed" or "Warning".
- Do not use markdown.
- Do not put the JSON inside code fences.
- Return only valid JSON.
          `,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Scan failed");
      }

      console.log("Scan result:", data);

      let parsed: ScanResult | null = null;

      if (typeof data?.reply === "string") {
        let reply = data.reply.trim();

        reply = reply
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();

        try {
          parsed = JSON.parse(reply);
        } catch {
          const firstBrace = reply.indexOf("{");
          const lastBrace = reply.lastIndexOf("}");

          if (firstBrace !== -1 && lastBrace !== -1) {
            try {
              parsed = JSON.parse(
                reply.slice(firstBrace, lastBrace + 1)
              );
            } catch {
              parsed = null;
            }
          }
        }
      }

      if (!parsed && data?.repoName) {
        parsed = data as ScanResult;
      }

      if (!parsed) {
        console.error("Could not parse scan result:", data);

        alert(
          "Scan completed, but the AI response was not in the expected format."
        );

        return;
      }

      setScanResult({
        repoName:
          parsed.repoName ||
          cleanUrl.replace("https://github.com/", "").replace(/\/$/, ""),
        score:
          typeof parsed.score === "number"
            ? Math.max(0, Math.min(100, parsed.score))
            : null,
        summary: parsed.summary || "Repository analysis completed.",
        checks: {
          README: parsed.checks?.README || "Warning",
          License: parsed.checks?.License || "Warning",
          "Recent activity":
            parsed.checks?.["Recent activity"] || "Warning",
          Description: parsed.checks?.Description || "Warning",
          "Open issues": parsed.checks?.["Open issues"] || "Warning",
          "Community health":
            parsed.checks?.["Community health"] || "Warning",
        },
      });

      alert("Scan completed!");
    } catch (error) {
      console.error("Scan error:", error);

      alert(
        error instanceof Error
          ? `Scan failed: ${error.message}`
          : "Scan failed"
      );
    } finally {
      setIsScanning(false);
    }
  };

  const displayedRepo =
    scanResult?.repoName ||
    (repoUrl
      ? repoUrl
          .replace("https://github.com/", "")
          .replace("http://github.com/", "")
          .replace(/\/$/, "")
      : "facebook / react");

  const score = scanResult?.score ?? 92;

  const healthLabel =
    score >= 80
      ? "Healthy"
      : score >= 60
        ? "Needs attention"
        : "At risk";

  const healthDescription =
    score >= 80
      ? "Excellent repository health"
      : score >= 60
        ? "Repository needs some attention"
        : "Repository needs significant improvement";

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111] transition-colors duration-300 dark:bg-[#111111] dark:text-white">

      {/* Navigation */}
      <nav className="border-b border-[#e9e2cf] bg-[#ffc515]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/reposheriff-logo.png"
              alt="RepoSheriff logo"
              className="h-16 w-28 object-contain"
            />

            <span className="text-xl font-bold tracking-tight text-[#111111]">
              RepoSheriff
            </span>
          </div>

          {/* Navigation links */}
          <div className="hidden items-center gap-8 text-sm font-bold text-[#111111] md:flex">
            <span className="cursor-pointer hover:underline">
              How it works
            </span>

            <span className="cursor-pointer hover:underline">
              Features
            </span>

            <span className="cursor-pointer hover:underline">
              About
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">

            {/* Day / Night Toggle */}
            <ThemeToggle />

            {/* GitHub */}
            <button className="rounded-lg border border-[#111111] bg-[#111111] px-4 py-2 text-sm font-medium text-[#ffc515] transition hover:bg-[#292923]">
              GitHub
            </button>

          </div>

        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e9d99d] bg-[#fff3c4] px-4 py-2 text-sm text-[#8d6d00]">
            <span className="h-2 w-2 rounded-full bg-[#ffc515]" />
            Open-source repository intelligence
          </div>

          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Know the health of
            <span className="text-[#b28700]">
              {" "}any repo.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6b685f] dark:text-gray-300">
            RepoSheriff analyzes GitHub repositories, scores their health,
            finds problems, and tells contributors exactly what to improve.
          </p>

          {/* Scanner */}
          <div className="mx-auto mt-10 max-w-2xl">

            <div className="flex flex-col gap-3 rounded-2xl border border-[#e9e2cf] bg-white p-3 shadow-xl dark:border-gray-700 dark:bg-gray-900 md:flex-row">

              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-[#111111] outline-none placeholder:text-[#aaa69a] dark:text-white dark:placeholder:text-gray-500"
              />

              <button
                onClick={handleScan}
                disabled={isScanning}
                className="rounded-xl bg-[#ffc515] px-7 py-3 font-semibold text-[#111111] transition hover:bg-[#edb500] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isScanning ? "Scanning..." : "Scan Repository"}
              </button>

            </div>

            <p className="mt-3 text-xs text-[#8b887e] dark:text-gray-400">
              No GitHub installation required. Paste a public repository URL.
            </p>

          </div>

        </div>

      </section>

      {/* Preview */}
      <section className="mx-auto max-w-6xl px-6 pb-24">

        <div className="overflow-hidden rounded-3xl border border-[#e9e2cf] bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">

          {/* Dashboard header */}
          <div className="flex items-center justify-between border-b border-[#e9e2cf] px-6 py-5 dark:border-gray-700">

            <div>
              <p className="text-sm text-[#8b887e] dark:text-gray-400">
                Repository health
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#111111] dark:text-white">
                {displayedRepo}
              </h2>
            </div>

            <div className="rounded-full bg-[#fff3c4] px-4 py-2 text-sm font-medium text-[#9a7400]">
              {healthLabel}
            </div>

          </div>

          <div className="grid gap-6 p-6 md:grid-cols-3">

            {/* Score */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 dark:border-gray-700 dark:bg-gray-800">

              <p className="text-sm text-[#8b887e] dark:text-gray-400">
                Health Score
              </p>

              <div className="mt-4 flex items-end gap-2">

                <span className="text-6xl font-bold text-[#111111] dark:text-white">
                  {score}
                </span>

                <span className="mb-2 text-[#8b887e] dark:text-gray-400">
                  / 100
                </span>

              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eee9dc] dark:bg-gray-700">

                <div
                  className="h-full rounded-full bg-[#ffc515]"
                  style={{ width: `${score}%` }}
                />

              </div>

              <p className="mt-3 text-sm text-[#b28700]">
                {healthDescription}
              </p>

              {scanResult?.summary && (
                <p className="mt-4 text-sm leading-6 text-[#6b685f] dark:text-gray-300">
                  {scanResult.summary}
                </p>
              )}

            </div>

            {/* Checks */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 dark:border-gray-700 dark:bg-gray-800 md:col-span-2">

              <p className="mb-4 text-sm text-[#8b887e] dark:text-gray-400">
                Repository checks
              </p>

              <div className="grid gap-3 sm:grid-cols-2">

                <Check
                  name="README"
                  status={scanResult?.checks.README || "Passed"}
                />

                <Check
                  name="License"
                  status={scanResult?.checks.License || "Passed"}
                />

                <Check
                  name="Recent activity"
                  status={
                    scanResult?.checks["Recent activity"] || "Passed"
                  }
                />

                <Check
                  name="Description"
                  status={scanResult?.checks.Description || "Passed"}
                />

                <Check
                  name="Open issues"
                  status={
                    scanResult?.checks["Open issues"] || "Warning"
                  }
                />

                <Check
                  name="Community health"
                  status={
                    scanResult?.checks["Community health"] || "Passed"
                  }
                />

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* Features */}
      <section className="border-t border-[#e9e2cf] bg-white dark:border-gray-700 dark:bg-[#111111]">

        <div className="mx-auto max-w-6xl px-6 py-20">

          <div className="mb-12 max-w-2xl">

            <p className="text-sm font-medium text-[#b28700]">
              WHAT REPOSHERIFF DOES
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#111111] dark:text-white md:text-4xl">
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
      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">
        RepoSheriff — GitHub repository health & contributor intelligence
      </footer>

    </main>
  );
}

function Check({
  name,
  status,
}: {
  name: string;
  status: "Passed" | "Warning";
}) {
  const passed = status === "Passed";

  return (
    <div className="flex items-center justify-between rounded-xl border border-[#e9e2cf] bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">

      <span className="text-sm text-[#4f4c45] dark:text-gray-300">
        {name}
      </span>

      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
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
    <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">

      <span className="text-sm font-semibold text-[#b28700]">
        {number}
      </span>

      <h3 className="mt-5 text-xl font-semibold text-[#111111] dark:text-white">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#6b685f] dark:text-gray-300">
        {description}
      </p>

    </div>
  );
}