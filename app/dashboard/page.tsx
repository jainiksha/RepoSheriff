"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";

type InterviewQuestion = {
  question: string;
  answer: string;
};

type InterviewQuestions = {
  easy: InterviewQuestion[];
  medium: InterviewQuestion[];
  advanced: InterviewQuestion[];
  critical: InterviewQuestion[];
};

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
  const [repositoryAnalyzed, setRepositoryAnalyzed] = useState(false);

  // Important for preventing hydration mismatch
  const [mounted, setMounted] = useState(false);

  /*
   * Read sessionStorage only after the component
   * has mounted in the browser.
   */
  useEffect(() => {
    setMounted(true);

    const savedScan = sessionStorage.getItem("reposheriff-scan");

    if (savedScan) {
      try {
        const parsed = JSON.parse(savedScan) as ScanResult;

        setScanResult(parsed);
        setRepositoryAnalyzed(true);
      } catch (error) {
        console.error("Could not load saved scan:", error);

        sessionStorage.removeItem("reposheriff-scan");
      }
    }
  }, []);

  const handleScan = async () => {
    if (!repoUrl.trim()) {
      alert("Please enter a GitHub repository URL.");
      return;
    }

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

      // Save the AI-generated interview questions for
      // /dashboard/interview.
      if (data?.interviewQuestions) {
        try {
          const interviewData =
            data.interviewQuestions as InterviewQuestions;

          const validInterviewData =
            Array.isArray(interviewData.easy) &&
            interviewData.easy.length === 10 &&
            Array.isArray(interviewData.medium) &&
            interviewData.medium.length === 10 &&
            Array.isArray(interviewData.advanced) &&
            interviewData.advanced.length === 10 &&
            Array.isArray(interviewData.critical) &&
            interviewData.critical.length === 10;

          if (validInterviewData) {
            sessionStorage.setItem(
              "reposheriff-interview",
              JSON.stringify(interviewData)
            );
          } else {
            console.warn(
              "Interview data did not contain exactly 10 questions per level."
            );

            sessionStorage.removeItem("reposheriff-interview");
          }
        } catch (error) {
          console.error(
            "Could not save interview questions:",
            error
          );

          sessionStorage.removeItem("reposheriff-interview");
        }
      } else {
        console.warn(
          "API response did not contain interviewQuestions."
        );

        sessionStorage.removeItem("reposheriff-interview");
      }

      let parsed: ScanResult | null = null;

      /*
       * Try to parse AI reply
       */
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

      /*
       * Fallback if API directly returns ScanResult
       */
      if (!parsed && data?.repoName) {
        parsed = data as ScanResult;
      }

      /*
       * Could not parse response
       */
      if (!parsed) {
        console.error("Could not parse scan result:", data);

        alert(
          "Scan completed, but the AI response was not in the expected format."
        );

        return;
      }

      /*
       * Build a clean result
       */
      const result: ScanResult = {
        repoName:
          parsed.repoName ||
          cleanUrl
            .replace("https://github.com/", "")
            .replace("http://github.com/", "")
            .replace(/\/$/, ""),

        score:
          typeof parsed.score === "number"
            ? Math.max(0, Math.min(100, parsed.score))
            : null,

        summary:
          parsed.summary || "Repository analysis completed.",

        checks: {
          README: parsed.checks?.README || "Warning",

          License:
            parsed.checks?.License || "Warning",

          "Recent activity":
            parsed.checks?.["Recent activity"] || "Warning",

          Description:
            parsed.checks?.Description || "Warning",

          "Open issues":
            parsed.checks?.["Open issues"] || "Warning",

          "Community health":
            parsed.checks?.["Community health"] || "Warning",
        },
      };

      /*
       * Update UI
       */
      setScanResult(result);
      setRepositoryAnalyzed(true);

      /*
       * Save result for Health / Summary / Issues pages
       */
      sessionStorage.setItem(
        "reposheriff-scan",
        JSON.stringify(result)
      );

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

  /*
   * Repository name shown in dashboard
   */
  const displayedRepo =
    scanResult?.repoName ||
    (repoUrl
      ? repoUrl
          .replace("https://github.com/", "")
          .replace("http://github.com/", "")
          .replace(/\/$/, "")
      : "facebook / react");

  /*
   * Default score for preview
   */
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
    <main className="min-h-screen overflow-x-hidden bg-[#fffdf5] text-[#111111] transition-colors duration-300 dark:bg-[#111111] dark:text-white">

      {/* =====================================================
          Navigation
      ====================================================== */}

      <nav className="border-b border-[#e9e2cf] bg-[#ffc515]">

        <div
          className="
            mx-auto
            flex
            w-full
            max-w-[1400px]
            flex-wrap
            items-center
            justify-between
            px-4
            py-3
            sm:px-6
            sm:py-4
          "
        >

          {/* Logo */}
          <div className="flex min-w-0 items-center gap-2">

            <img
              src="/reposheriff-logo.png"
              alt="RepoSheriff logo"
              className="h-10 w-14 shrink-0 object-contain sm:h-12 sm:w-16"
            />

            <span className="text-lg font-bold tracking-tight text-[#111111] sm:text-xl">
              RepoSheriff
            </span>

          </div>


          {/* User */}
          <div className="order-2 shrink-0">
            <UserButton />
          </div>


          {/* =================================================
              Navigation Links
              Desktop: one row
              Mobile: second horizontally scrollable row
          ================================================== */}

          <div
            className="
              order-3
              mt-2
              flex
              w-full
              items-center
              justify-start
              gap-4
              overflow-x-auto
              text-xs
              font-bold
              text-[#111111]

              [scrollbar-width:none]
              [&::-webkit-scrollbar]:hidden

              sm:gap-5
              sm:text-sm

              md:order-none
              md:mt-0
              md:w-auto
              md:max-w-none
              md:justify-end
              md:gap-6
              md:overflow-visible
            "
          >

            {/* Repository Health */}
            <span
              className={`shrink-0 whitespace-nowrap ${
                mounted && repositoryAnalyzed
                  ? "cursor-pointer hover:underline"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (!mounted || !repositoryAnalyzed) return;

                window.location.href = "/dashboard/health";
              }}
            >
              Repository Health
              {(!mounted || !repositoryAnalyzed) && " 🔒"}
            </span>


            {/* Project Summary */}
            <span
              className={`shrink-0 whitespace-nowrap ${
                mounted && repositoryAnalyzed
                  ? "cursor-pointer hover:underline"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (!mounted || !repositoryAnalyzed) return;

                window.location.href = "/dashboard/summary";
              }}
            >
              Project Summary
              {(!mounted || !repositoryAnalyzed) && " 🔒"}
            </span>


            {/* Issue Suggestions */}
            <span
              className={`shrink-0 whitespace-nowrap ${
                mounted && repositoryAnalyzed
                  ? "cursor-pointer hover:underline"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (!mounted || !repositoryAnalyzed) return;

                window.location.href = "/dashboard/issues";
              }}
            >
              Issue Suggestions
              {(!mounted || !repositoryAnalyzed) && " 🔒"}
            </span>


            {/* Documentation */}
            <span
              className={`shrink-0 whitespace-nowrap ${
                mounted && repositoryAnalyzed
                  ? "cursor-pointer hover:underline"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (!mounted || !repositoryAnalyzed) return;

                window.location.href = "/dashboard/documentation";
              }}
            >
              Documentation
              {(!mounted || !repositoryAnalyzed) && " 🔒"}
            </span>


            {/* Interview */}
            <span
              className={`shrink-0 whitespace-nowrap ${
                mounted && repositoryAnalyzed
                  ? "cursor-pointer hover:underline"
                  : "cursor-not-allowed opacity-50"
              }`}
              onClick={() => {
                if (!mounted || !repositoryAnalyzed) return;

                window.location.href = "/dashboard/interview";
              }}
            >
              Interview Question
              {(!mounted || !repositoryAnalyzed) && " 🔒"}
            </span>


            {/* GitHub Tutorials */}
            <span
              className="shrink-0 cursor-pointer whitespace-nowrap hover:underline"
              onClick={() => {
                window.location.href = "/dashboard/tutorials";
              }}
            >
              GitHub Tutorials
            </span>


            {/* About */}
            <span
              className="shrink-0 cursor-pointer whitespace-nowrap hover:underline"
              onClick={() => {
                window.location.href = "/dashboard/about";
              }}
            >
              About
            </span>

          </div>

        </div>

      </nav>


      {/* =====================================================
          Hero
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pb-20 sm:pt-20 md:pt-24">

        <div className="mx-auto max-w-3xl text-center">

          {/* Badge */}
          <div className="mb-6 inline-flex max-w-full items-center gap-2 rounded-full border border-[#e9d99d] bg-[#fff3c4] px-3 py-2 text-xs text-[#8d6d00] sm:px-4 sm:text-sm">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[#ffc515]" />
            <span className="truncate">
              Open-source repository intelligence
            </span>
          </div>


          {/* Heading */}
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-7xl">
            Your repo has secrets,
            <span className="text-[#b28700]">
              {" "}We find them.
            </span>
          </h1>


          {/* Description */}
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#6b685f] sm:mt-6 sm:text-lg sm:leading-8 dark:text-gray-300">
            RepoSheriff analyzes GitHub repositories, scores their health,
            finds problems, and tells contributors exactly what to improve.
          </p>


          {/* Scanner */}
          <div className="mx-auto mt-8 w-full max-w-2xl sm:mt-10">

            <div
              className="
                flex
                flex-col
                gap-3
                rounded-2xl
                border
                border-[#e9e2cf]
                bg-white
                p-3
                shadow-xl
                dark:border-gray-700
                dark:bg-gray-900
                md:flex-row
              "
            >

              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleScan();
                  }
                }}
                placeholder="https://github.com/owner/repository"
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  bg-transparent
                  px-4
                  py-3
                  text-sm
                  text-[#111111]
                  outline-none
                  placeholder:text-[#aaa69a]
                  dark:text-white
                  dark:placeholder:text-gray-500
                "
              />


              <button
                type="button"
                onClick={handleScan}
                disabled={isScanning}
                className="
                  w-full
                  rounded-xl
                  bg-[#ffc515]
                  px-7
                  py-3
                  font-semibold
                  text-[#111111]
                  transition
                  hover:bg-[#edb500]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  md:w-auto
                  md:shrink-0
                "
              >
                {isScanning ? "Scanning..." : "Scan Repository"}
              </button>

            </div>


            <p className="mt-3 text-xs leading-5 text-[#8b887e] dark:text-gray-400">
              No GitHub installation required. Paste a public repository URL.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          Features
      ====================================================== */}

      <section className="border-t border-[#e9e2cf] bg-white dark:border-gray-700 dark:bg-[#111111]">

        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">

          <div className="mb-10 max-w-2xl sm:mb-12">

            <p className="text-sm font-medium text-[#b28700]">
              WHAT REPOSHERIFF DOES
            </p>


            <h2 className="mt-3 text-2xl font-bold leading-tight text-[#111111] sm:text-3xl md:text-4xl dark:text-white">
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


      {/* =====================================================
          Footer
      ====================================================== */}

      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-4 py-7 text-center text-xs leading-5 text-[#5f531f] sm:px-6 sm:py-8 sm:text-sm">
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


/* =========================================================
   Feature Component
========================================================= */

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
    <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5 transition hover:-translate-y-1 hover:shadow-lg sm:p-6 dark:border-gray-700 dark:bg-gray-900">

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