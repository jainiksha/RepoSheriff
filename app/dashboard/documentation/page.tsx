"use client";

import { useEffect, useState } from "react";

type ScanResult = {
  repoName: string;
  score: number | null;
  summary: string;
  checks?: {
    README?: "Passed" | "Warning";
    License?: "Passed" | "Warning";
    "Recent activity"?: "Passed" | "Warning";
    Description?: "Passed" | "Warning";
    "Open issues"?: "Passed" | "Warning";
    "Community health"?: "Passed" | "Warning";
  };
};

export default function DocumentationPage() {
  const [repository, setRepository] = useState<ScanResult | null>(null);
  const [readme, setReadme] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedScan = sessionStorage.getItem("reposheriff-scan");

    if (savedScan) {
      try {
        const parsed = JSON.parse(savedScan) as ScanResult;
        setRepository(parsed);
      } catch (error) {
        console.error("Could not load repository:", error);
      }
    }
  }, []);

  const generateReadme = async () => {
    if (!repository) {
      alert("Please scan a repository first.");
      return;
    }

    setIsGenerating(true);
    setCopied(false);

    try {
      const response = await fetch("/api/documentation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoName: repository.repoName,
          summary: repository.summary,
          score: repository.score,
          checks: repository.checks,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "README generation failed.");
      }

      if (!data?.readme) {
        throw new Error("No README was generated.");
      }

      setReadme(data.readme);
    } catch (error) {
      console.error("README generation error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Failed to generate README."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const copyReadme = async () => {
    if (!readme) return;

    try {
      await navigator.clipboard.writeText(readme);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy failed:", error);
      alert("Could not copy README.");
    }
  };

  const downloadReadme = () => {
    if (!readme) return;

    const blob = new Blob([readme], {
      type: "text/markdown;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "README.md";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-[#e9e2cf] bg-[#ffc515]">

        <div className="mx-auto max-w-6xl px-6 py-14">

          <p className="text-sm font-bold uppercase tracking-[2px] text-[#735800]">
            RepoSheriff Documentation
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Generate better documentation.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#5f531f]">
            Create a professional README for your GitHub repository
            using the information analyzed by RepoSheriff.
          </p>

        </div>

      </section>


      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-16">


        {/* =================================================
            REPOSITORY CARD
        ================================================= */}

        <div className="mb-8 rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-sm">

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            <div>

              <p className="text-xs font-bold uppercase tracking-[2px] text-[#b28700]">
                Repository
              </p>

              <h2 className="mt-3 text-2xl font-bold">
                {repository?.repoName || "No repository scanned"}
              </h2>

              <p className="mt-2 text-[#6b685f]">
                {repository
                  ? "Generate documentation based on your scanned repository."
                  : "Scan a GitHub repository first to generate documentation."}
              </p>

            </div>


            {/* Repository Score */}

            {repository?.score !== null &&
              repository?.score !== undefined && (
                <div className="rounded-2xl bg-[#fff3c4] px-6 py-4 text-center">

                  <p className="text-xs font-bold uppercase tracking-widest text-[#9a7400]">
                    Health Score
                  </p>

                  <p className="mt-1 text-3xl font-bold text-[#111111]">
                    {repository.score}
                    <span className="text-base text-[#9a7400]">
                      /100
                    </span>
                  </p>

                </div>
              )}

          </div>


          {/* Generate Button */}

          <div className="mt-8 border-t border-[#eee8d8] pt-6">

            <button
              type="button"
              onClick={generateReadme}
              disabled={isGenerating || !repository}
              className="rounded-xl bg-[#111111] px-7 py-3 font-bold text-[#ffc515] transition hover:-translate-y-0.5 hover:bg-[#2a2a25] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isGenerating
                ? "Generating README..."
                : "Generate README"}
            </button>

          </div>

        </div>


        {/* =================================================
            WHAT WILL BE GENERATED
        ================================================= */}

        {!readme && !isGenerating && (

          <div className="mb-8 grid gap-5 md:grid-cols-3">

            <DocumentationFeature
              number="01"
              title="Project Overview"
              description="Generate a clear explanation of what the repository does and the problem it solves."
            />

            <DocumentationFeature
              number="02"
              title="Technical Documentation"
              description="Explain the technology stack, features, installation and project structure."
            />

            <DocumentationFeature
              number="03"
              title="Contribution Guide"
              description="Generate useful sections for usage, contributing and future improvements."
            />

          </div>

        )}


        {/* =================================================
            LOADING
        ================================================= */}

        {isGenerating && (

          <div className="rounded-3xl border border-[#e9e2cf] bg-white p-10 text-center shadow-sm">

            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#eee8d8] border-t-[#ffc515]" />

            <h2 className="mt-6 text-xl font-bold">
              Generating your README...
            </h2>

            <p className="mt-2 text-[#6b685f]">
              RepoSheriff is preparing documentation based on your repository.
            </p>

          </div>

        )}


        {/* =================================================
            GENERATED README
        ================================================= */}

        {readme && !isGenerating && (

          <div className="rounded-3xl border border-[#e9e2cf] bg-white shadow-xl">

            {/* README Header */}

            <div className="flex flex-col justify-between gap-4 border-b border-[#e9e2cf] p-6 md:flex-row md:items-center">

              <div>

                <p className="text-xs font-bold uppercase tracking-[2px] text-[#b28700]">
                  Generated Documentation
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  README.md
                </h2>

              </div>


              {/* Action Buttons */}

              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  onClick={copyReadme}
                  className="rounded-xl border border-[#e9e2cf] bg-[#fffdf5] px-5 py-2.5 text-sm font-bold transition hover:bg-[#fff3c4]"
                >
                  {copied ? "Copied!" : "Copy README"}
                </button>

                <button
                  type="button"
                  onClick={downloadReadme}
                  className="rounded-xl bg-[#ffc515] px-5 py-2.5 text-sm font-bold text-[#111111] transition hover:bg-[#edb500]"
                >
                  Download README.md
                </button>

              </div>

            </div>


            {/* README Preview */}

            <div className="p-6 md:p-8">

              <pre className="max-h-[700px] overflow-auto whitespace-pre-wrap break-words rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 font-mono text-sm leading-7 text-[#292722]">
                {readme}
              </pre>

            </div>


            {/* Generate Again */}

            <div className="border-t border-[#e9e2cf] p-6">

              <button
                type="button"
                onClick={generateReadme}
                className="rounded-xl bg-[#111111] px-6 py-3 font-bold text-[#ffc515] transition hover:bg-[#2a2a25]"
              >
                Generate Again
              </button>

            </div>

          </div>

        )}

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">
        RepoSheriff — Documentation Generator
      </footer>

    </main>
  );
}


/* =========================================================
   DOCUMENTATION FEATURE
========================================================= */

function DocumentationFeature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e9e2cf] bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg">

      <span className="text-sm font-bold text-[#b28700]">
        {number}
      </span>

      <h3 className="mt-5 text-xl font-bold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-[#6b685f]">
        {description}
      </p>

    </div>
  );
}