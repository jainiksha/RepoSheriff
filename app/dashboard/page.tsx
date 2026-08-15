"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
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
    <main className="min-h-screen bg-[#fffdf5] text-[#111111]">

      {/* ================= HEADER ================= */}
      <section className="border-b border-[#e9e2cf] bg-[#ffc515]">
        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold uppercase tracking-wider text-[#5f531f]">
            REPOSITORY INTELLIGENCE
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            About RepoSheriff
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f531f]">
            Making GitHub repositories easier to understand, analyze,
            improve, and contribute to.
          </p>

          <UserButton />

        </div>

      </section>


      {/* ================= THE PROBLEM ================= */}
      <section className="border-y border-[#e9e2cf] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-16">
          {/* Heading */}
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Your repo has secrets,
            <span className="text-[#b28700]">
              {" "}We find them.
            </span>
          </h1>

          <p className="text-sm font-bold tracking-wider text-[#b28700]">
            THE PROBLEM
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Understanding an unfamiliar repository takes time.
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-gray-600">
            When developers enter a new project, they often need to understand
            its structure, architecture, technologies, dependencies, code
            quality, and existing issues before they can confidently make
            changes or contribute.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6">
              <div className="text-3xl">📂</div>

              <h3 className="mt-4 text-xl font-bold">
                Explore
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                Developers manually explore folders, files, documentation,
                and project structure.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6">
              <div className="text-3xl">🧩</div>

              <h3 className="mt-4 text-xl font-bold">
                Understand
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                They need to understand how different parts of the repository
                work together.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6">
              <div className="text-3xl">⏳</div>

              <h3 className="mt-4 text-xl font-bold">
                Spend Time
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                This can create a long onboarding process before meaningful
                contribution can begin.
              </p>
            </div>

          </div>

        </div>

      </section>

      


      {/* ================= WHO IS IT FOR ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <p className="text-sm font-bold tracking-wider text-[#b28700]">
          WHO IS REPOSHERIFF FOR?
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          Built for developers and contributors.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm">
            <div className="text-3xl">👨‍💻</div>

            <h3 className="mt-4 text-xl font-bold">
              Developers
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Understand unfamiliar codebases faster and get a clearer
              picture of project structure and health.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm">
            <div className="text-3xl">🌱</div>

            <h3 className="mt-4 text-xl font-bold">
              Beginners
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Reduce the difficulty of entering unfamiliar open-source
              repositories.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm">
            <div className="text-3xl">🤝</div>

            <h3 className="mt-4 text-xl font-bold">
              Contributors
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Find useful starting points and understand where meaningful
              contributions can be made.
            </p>
          </div>

        </div>

      </section>


      {/* ================= WHY REPOSHERIFF ================= */}
      <section className="border-y border-[#e9e2cf] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold tracking-wider text-[#b28700]">
            WHY REPOSHERIFF?
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Spend less time exploring. Start contributing sooner.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {/* Traditional */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-8">

              <h3 className="text-xl font-bold">
                Traditional Approach
              </h3>

              <div className="mt-6 space-y-4 text-gray-600">
                <p>📖 Read documentation</p>
                <p>📂 Explore files manually</p>
                <p>🧩 Understand architecture</p>
                <p>🔍 Search for issues</p>
                <p>⏳ Spend hours onboarding</p>
              </div>

            </div>


            {/* RepoSheriff */}
            <div className="rounded-2xl border-2 border-[#ffc515] bg-[#fffdf5] p-8">

              <h3 className="text-xl font-bold">
                With RepoSheriff
              </h3>

              <div className="mt-6 space-y-4 text-gray-600">
                <p>🤖 AI-powered repository analysis</p>
                <p>📊 Quick repository insights</p>
                <p>🧩 Easier architecture understanding</p>
                <p>🐞 Issue and improvement insights</p>
                <p>🚀 Contribution guidance</p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#ffc515] px-6 py-20 text-center">

        <p className="text-sm font-bold uppercase tracking-wider text-[#5f531f]">
          REPOSHERIFF
        </p>

        <h2 className="mt-3 text-4xl font-bold md:text-5xl">
          Minutes, Not Hours.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5f531f]">
          Turn complex repository exploration into a clearer,
          AI-guided experience.
        </p>

        <p className="mt-8 text-lg font-bold">
          Analyze • Understand • Improve • Contribute
        </p>

      </section>

    </main>
  );
}