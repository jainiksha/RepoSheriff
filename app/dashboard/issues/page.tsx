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

export default function IssueSuggestions() {
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
const [loading, setLoading] = useState(true);
const [mounted, setMounted] = useState(false);

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

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fffdf5] px-6 py-20 text-[#111111] dark:bg-[#111111] dark:text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-[#6b685f] dark:text-gray-400">
            Loading issue suggestions...
          </p>
        </div>
      </main>
    );
  }

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
              Please scan a GitHub repository from the dashboard before
              viewing issue suggestions.
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

  /*
   * Temporary issue suggestions.
   *
   * These will be replaced with AI-generated suggestions
   * in the next step.
   */
  const categories: IssueCategory[] = [
    {
      id: "features",
      icon: "✨",
      title: "New Features",
      description:
        "Potential functionality that could make the project more useful.",
      issues: [
        {
          title: "Add Repository Health History",
          description:
            "Store previous repository health scores so maintainers can track improvements and regressions over time.",
          priority: "Medium",
        },
        {
          title: "Add Contributor Difficulty Labels",
          description:
            "Automatically categorize suggested issues as Beginner, Intermediate, or Advanced to help contributors choose suitable tasks.",
          priority: "Medium",
        },
        {
          title: "Add Issue Recommendation Filtering",
          description:
            "Allow users to filter suggestions by category, priority, and contribution difficulty.",
          priority: "Low",
        },
      ],
    },

    {
      id: "bugs",
      icon: "🐛",
      title: "Bugs",
      description:
        "Potential problems that could affect reliability or user experience.",
      issues: [
        {
          title: "Handle Invalid GitHub Repository URLs Gracefully",
          description:
            "Display a clear validation message when a user enters an invalid or unavailable GitHub repository URL instead of allowing the scan to fail unexpectedly.",
          priority: "High",
        },
        {
          title: "Improve API Error Handling",
          description:
            "Handle GitHub API failures, rate limits, timeouts, and unavailable repository responses with user-friendly error messages.",
          priority: "High",
        },
      ],
    },

    {
      id: "documentation",
      icon: "📚",
      title: "Documentation",
      description:
        "Documentation improvements that could make the project easier to understand and contribute to.",
      issues: [
        {
          title: "Add Complete Local Setup Instructions",
          description:
            "Provide clear instructions for installing dependencies, configuring environment variables, starting the development server, and running the project locally.",
          priority: "Medium",
        },
        {
          title: "Add Contributor Guide",
          description:
            "Create a contributor guide explaining how to create issues, work on features, submit pull requests, and follow project conventions.",
          priority: "Medium",
        },
      ],
    },

    {
      id: "uiux",
      icon: "🎨",
      title: "UI/UX",
      description:
        "Ideas for improving usability, accessibility, and the overall interface.",
      issues: [
        {
          title: "Improve Repository Analysis Loading State",
          description:
            "Add a detailed loading experience showing which stage of repository analysis is currently running.",
          priority: "Low",
        },
        {
          title: "Improve Issue Suggestion Cards",
          description:
            "Add clearer category indicators, priority badges, descriptions, and contribution difficulty to issue suggestion cards.",
          priority: "Low",
        },
        {
          title: "Improve Mobile Navigation",
          description:
            "Add a responsive mobile navigation menu so all repository analysis sections remain accessible on smaller screens.",
          priority: "Medium",
        },
      ],
    },

    {
      id: "performance",
      icon: "⚡",
      title: "Performance",
      description:
        "Potential improvements for faster repository analysis and a smoother experience.",
      issues: [
        {
          title: "Cache Repository Analysis Results",
          description:
            "Cache recently analyzed repositories to avoid repeatedly fetching the same GitHub information and improve response time.",
          priority: "Medium",
        },
        {
          title: "Optimize Repository Data Fetching",
          description:
            "Reduce unnecessary API requests and fetch only the repository information required for the analysis.",
          priority: "Medium",
        },
      ],
    },

    {
      id: "testing",
      icon: "🧪",
      title: "Testing",
      description:
        "Testing improvements that can make the project more reliable.",
      issues: [
        {
          title: "Add Repository URL Validation Tests",
          description:
            "Add automated tests covering valid repositories, invalid URLs, private repositories, and unavailable repositories.",
          priority: "Medium",
        },
        {
          title: "Add API Route Tests",
          description:
            "Create tests for successful scans, API failures, malformed responses, and GitHub rate-limit scenarios.",
          priority: "Medium",
        },
      ],
    },

    {
      id: "security",
      icon: "🔒",
      title: "Security",
      description:
        "Potential improvements for protecting the application and repository analysis process.",
      issues: [
        {
          title: "Validate Repository URLs Before Processing",
          description:
            "Strictly validate GitHub repository URLs before sending them to external services or APIs.",
          priority: "High",
        },
        {
          title: "Protect API Configuration",
          description:
            "Ensure API keys and other sensitive configuration values are stored only in environment variables and never exposed to the client.",
          priority: "High",
        },
      ],
    },

    {
      id: "accessibility",
      icon: "♿",
      title: "Accessibility",
      description:
        "Improvements that can make RepoSheriff easier to use for everyone.",
      issues: [
        {
          title: "Improve Keyboard Navigation",
          description:
            "Ensure navigation links, repository controls, issue cards, and actions can be accessed and operated using the keyboard.",
          priority: "Medium",
        },
        {
          title: "Improve Screen Reader Labels",
          description:
            "Add appropriate accessible labels and semantic elements to repository analysis controls and interactive components.",
          priority: "Medium",
        },
      ],
    },
  ];

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

            {/* Suggestions only */}
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

        {/* Categories */}
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

/* --------------------------------
   Issue Card
--------------------------------- */

function IssueCard({
  issue,
  category,
}: {
  issue: Issue;
  category: string;
}) {
  const priorityClass =
    issue.priority === "High"
      ? "bg-[#ffe0d8] text-[#a33a20]"
      : issue.priority === "Medium"
        ? "bg-[#fff3c4] text-[#9a7400]"
        : "bg-[#eee9dc] text-[#6b685f]";

  const handleCreateIssue = () => {
    alert(
      `Issue selected:\n\n${issue.title}\n\nCategory: ${category}\nPriority: ${issue.priority}`
    );
  };

  return (
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
  );
}