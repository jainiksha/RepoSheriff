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

type Issue = {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
};

type IssueCategory = {
  id: string;
  icon: string;
  title: string;
  description: string;
  issues: Issue[];
};

type IssueSuggestionsResponse = {
  repoName: string;
  categories: IssueCategory[];
  aiEnhanced: boolean;
};

export default function IssueSuggestions() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [categories, setCategories] = useState<IssueCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        // Get scanned repository information
        const savedScan = sessionStorage.getItem("reposheriff-scan");

        if (!savedScan) {
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(savedScan) as ScanResult;
        setScanResult(parsed);

        // Convert owner/repository into a GitHub URL
        const repoUrl = `https://github.com/${parsed.repoName}`;

        // Check if suggestions are already cached
        const cacheKey = `reposheriff-issue-suggestions-${parsed.repoName}`;

        const cachedSuggestions =
          sessionStorage.getItem(cacheKey);

        if (cachedSuggestions) {
          try {
            const cached =
              JSON.parse(cachedSuggestions) as IssueSuggestionsResponse;

            if (cached.categories) {
              setCategories(cached.categories);
              setLoading(false);
              return;
            }
          } catch {
            sessionStorage.removeItem(cacheKey);
          }
        }

        // Ask our API to generate suggestions
        const response = await fetch("/api/issue-suggestions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repoUrl,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error || "Failed to generate issue suggestions"
          );
        }

        console.log("Issue suggestions:", data);

        // Save the result so we don't call Groq again
        // every time the user opens this page.
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify(data)
        );

        setCategories(data.categories || []);
      } catch (err) {
        console.error("Issue suggestions error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while generating issue suggestions."
        );
      } finally {
        setLoading(false);
      }
    };

    loadSuggestions();
  }, []);

  // -----------------------------
  // Loading
  // -----------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-6 py-20 text-[#111111]">
        <div className="mx-auto max-w-6xl text-center">
          <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-[#e9e2cf] border-t-[#ffc515]" />

          <p className="text-lg font-semibold">
            Analyzing repository...
          </p>

          <p className="mt-2 text-[#6b685f]">
            RepoSheriff is finding useful contribution opportunities.
          </p>
        </div>
      </main>
    );
  }

  // -----------------------------
  // No repository
  // -----------------------------

  if (!scanResult) {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-6 py-20 text-[#111111]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-3xl border border-[#e9e2cf] bg-white p-10 shadow-lg">
            <div className="text-5xl">🔒</div>

            <h1 className="mt-5 text-3xl font-bold">
              No Repository Scanned
            </h1>

            <p className="mt-4 leading-7 text-[#6b685f]">
              Please scan a GitHub repository from the dashboard
              before viewing issue suggestions.
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

  // -----------------------------
  // API Error
  // -----------------------------

  if (error) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#111111]">
        <nav className="border-b border-[#e9e2cf] bg-[#ffc515]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2">
              <img
                src="/reposheriff-logo.png"
                alt="RepoSheriff logo"
                className="h-14 w-24 object-contain"
              />

              <span className="text-xl font-bold tracking-tight">
                RepoSheriff
              </span>
            </div>

            <a
              href="/dashboard"
              className="rounded-lg border border-[#111111] bg-[#111111] px-5 py-2 text-sm font-semibold text-[#ffc515]"
            >
              ← Dashboard
            </a>
          </div>
        </nav>

        <section className="mx-auto max-w-3xl px-6 py-20">
          <div className="rounded-3xl border border-[#e9e2cf] bg-white p-10 text-center shadow-lg">
            <div className="text-5xl">⚠️</div>

            <h1 className="mt-5 text-3xl font-bold">
              Could not generate suggestions
            </h1>

            <p className="mt-4 leading-7 text-[#6b685f]">
              RepoSheriff could not generate AI issue suggestions
              for this repository.
            </p>

            <div className="mt-6 rounded-xl bg-[#fff3c4] p-4 text-left text-sm">
              <strong>Error:</strong> {error}
            </div>

            <a
              href="/dashboard"
              className="mt-7 inline-flex rounded-xl bg-[#ffc515] px-6 py-3 font-semibold"
            >
              ← Back to Dashboard
            </a>
          </div>
        </section>
      </main>
    );
  }

  const totalIssues = categories.reduce(
    (total, category) => total + category.issues.length,
    0
  );

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111] transition-colors duration-300 dark:bg-[#111111] dark:text-white">

      {/* Header */}
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

      {/* Main */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        {/* Heading */}
        <div className="mb-10">

          <p className="text-sm font-semibold uppercase tracking-wider text-[#b28700]">
            Repository Intelligence
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Suggested Issues
          </h1>

          <p className="mt-4 max-w-3xl text-lg leading-8 text-[#6b685f] dark:text-gray-300">
            Potential contribution opportunities identified for{" "}
            <span className="font-semibold text-[#111111] dark:text-white">
              {scanResult.repoName}
            </span>
            .
          </p>

          <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff3c4] px-4 py-2 text-sm font-semibold text-[#9a7400]">
            ✨ AI-powered suggestions
          </div>

        </div>

        {/* Repository info */}
        <div className="mb-8 rounded-3xl border border-[#e9e2cf] bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-[#8b887e] dark:text-gray-400">
                Repository
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                {scanResult.repoName}
              </h2>
            </div>

            <div className="rounded-xl bg-[#fff3c4] px-6 py-3 text-center">
              <p className="text-xs text-[#9a7400]">
                Suggestions
              </p>

              <p className="mt-1 text-xl font-bold text-[#111111]">
                {totalIssues}
              </p>
            </div>

          </div>
        </div>

        {/* AI Categories */}
        {categories.length === 0 ? (
          <div className="rounded-3xl border border-[#e9e2cf] bg-white p-10 text-center shadow-lg">
            <div className="text-5xl">🔍</div>

            <h2 className="mt-5 text-2xl font-bold">
              No suggestions found
            </h2>

            <p className="mt-3 text-[#6b685f]">
              We couldn't find any contribution opportunities
              for this repository.
            </p>
          </div>
        ) : (
          <div className="space-y-8">

            {categories.map((category) => (
              <section
                key={category.id}
                className="rounded-3xl border border-[#e9e2cf] bg-white p-7 shadow-lg dark:border-gray-700 dark:bg-gray-900"
              >

                {/* Category heading */}
                <div className="mb-6 flex items-start gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff3c4] text-2xl">
                    {category.icon}
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold">
                      {category.title}
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-[#6b685f] dark:text-gray-400">
                      {category.description}
                    </p>
                  </div>

                  <span className="ml-auto rounded-full bg-[#f5f0df] px-3 py-1 text-xs font-semibold text-[#6b685f] dark:bg-gray-800 dark:text-gray-300">
                    {category.issues.length}
                  </span>

                </div>

                {/* Issues */}
                <div className="space-y-4">

                  {category.issues.map((issue, index) => (
                    <IssueCard
                      key={`${category.id}-${index}`}
                      issue={issue}
                      category={category.title}
                    />
                  ))}

                </div>

              </section>
            ))}

          </div>
        )}

        {/* Bottom navigation */}
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-between">

          <a
            href="/dashboard/health"
            className="rounded-xl border border-[#e9e2cf] bg-white px-6 py-3 text-center font-semibold transition hover:bg-[#fff3c4] dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
          >
            ← Repository Health
          </a>

          <a
            href="/dashboard"
            className="rounded-xl bg-[#ffc515] px-6 py-3 text-center font-semibold text-[#111111] transition hover:bg-[#edb500]"
          >
            Scan Another Repository
          </a>

        </div>

      </section>

      {/* Footer */}
      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">
        RepoSheriff — GitHub repository health & contributor intelligence
      </footer>

    </main>
  );
}
function IssueCard({
  issue,
  category,
}: {
  issue: Issue;
  category: string;
}) {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState(issue.title);
  const [description, setDescription] = useState(issue.description);

  const priorityClass =
    issue.priority === "High"
      ? "bg-[#ffe0d8] text-[#a33a20]"
      : issue.priority === "Medium"
        ? "bg-[#fff3c4] text-[#9a7400]"
        : "bg-[#eee9dc] text-[#6b685f]";

  const handleCreateIssue = () => {
    setShowModal(true);
  };

  const handleSubmitIssue = () => {
    alert(
      `Issue ready to create:\n\n${title}\n\n${description}\n\nCategory: ${category}\nPriority: ${issue.priority}`
    );

    setShowModal(false);
  };

  return (
    <>
      {/* Issue Card */}
      <div className="group rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 transition hover:-translate-y-1 hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-lg font-bold text-[#111111] dark:text-white">
                {issue.title}
              </h3>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClass}`}
              >
                {issue.priority} Priority
              </span>
            </div>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6b685f] dark:text-gray-300">
              {issue.description}
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreateIssue}
            className="shrink-0 rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-[#ffc515] transition hover:bg-[#292923]"
          >
            Create Issue
          </button>
        </div>
      </div>

      {/* Create Issue Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-2xl rounded-3xl border border-[#e9e2cf] bg-white p-7 shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-[#b28700]">
                  Create GitHub Issue
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#111111] dark:text-white">
                  Review Issue Details
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-lg px-3 py-2 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Title */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-semibold text-[#111111] dark:text-white">
                Issue Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-[#e9e2cf] bg-[#fffdf5] px-4 py-3 text-sm text-[#111111] outline-none transition focus:border-[#ffc515] focus:ring-2 focus:ring-[#ffc515]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Description */}
            <div className="mt-5">
              <label className="mb-2 block text-sm font-semibold text-[#111111] dark:text-white">
                Issue Description
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full resize-none rounded-xl border border-[#e9e2cf] bg-[#fffdf5] px-4 py-3 text-sm leading-6 text-[#111111] outline-none transition focus:border-[#ffc515] focus:ring-2 focus:ring-[#ffc515]/30 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Category and Priority */}
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              
              <div>
                <p className="mb-2 text-sm font-semibold text-[#111111] dark:text-white">
                  Category
                </p>

                <div className="rounded-xl bg-[#fff3c4] px-4 py-3 text-sm font-semibold text-[#9a7400]">
                  {category}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[#111111] dark:text-white">
                  Priority
                </p>

                <div
                  className={`rounded-xl px-4 py-3 text-sm font-semibold ${priorityClass}`}
                >
                  {issue.priority}
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-[#e9e2cf] bg-white px-5 py-3 text-sm font-semibold text-[#111111] transition hover:bg-[#fff3c4] dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmitIssue}
                className="rounded-xl bg-[#111111] px-5 py-3 text-sm font-semibold text-[#ffc515] transition hover:bg-[#292923]"
              >
                Create Issue
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
