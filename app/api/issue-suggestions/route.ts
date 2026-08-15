import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const GROQ_MODEL = "llama-3.3-70b-versatile";

type GitHubRepo = {
  full_name: string;
  name: string;
  description: string | null;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
};

type GitHubContent = {
  name: string;
  path: string;
  type: string;
};

type Suggestion = {
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
};

type IssueCategory = {
  id: string;
  icon: string;
  title: string;
  description: string;
  issues: Suggestion[];
};

async function githubFetch<T>(url: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, {
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `GitHub API request failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
}

function extractGitHubRepository(
  url: string
): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);

    if (
      parsed.hostname !== "github.com" &&
      parsed.hostname !== "www.github.com"
    ) {
      return null;
    }

    const parts = parsed.pathname.split("/").filter(Boolean);

    if (parts.length < 2) {
      return null;
    }

    const owner = parts[0];
    const repo = parts[1].replace(/\.git$/, "");

    if (!owner || !repo) {
      return null;
    }

    return {
      owner,
      repo,
    };
  } catch {
    return null;
  }
}

function createRuleBasedSuggestions(
  repo: GitHubRepo,
  rootFiles: GitHubContent[]
): IssueCategory[] {
  const fileNames = new Set(rootFiles.map((file) => file.name.toLowerCase()));

  const documentation: Suggestion[] = [];
  const bugs: Suggestion[] = [];
  const features: Suggestion[] = [];
  const testing: Suggestion[] = [];
  const security: Suggestion[] = [];
  const performance: Suggestion[] = [];
  const accessibility: Suggestion[] = [];
  const uiux: Suggestion[] = [];

  // -----------------------------
  // Documentation
  // -----------------------------

  if (!fileNames.has("readme.md")) {
    documentation.push({
      title: "Add a README",
      description:
        "Create a README explaining the project, installation steps, usage, and contribution process.",
      priority: "High",
    });
  }

  if (!fileNames.has("license") && !fileNames.has("license.md")) {
    documentation.push({
      title: "Add a Project License",
      description:
        "Add a license file so users and contributors understand how the project can be used and modified.",
      priority: "Medium",
    });
  }

  if (!fileNames.has("contributing.md")) {
    documentation.push({
      title: "Add Contributor Guide",
      description:
        "Create a CONTRIBUTING.md file explaining how contributors can set up the project, create issues, and submit pull requests.",
      priority: "Medium",
    });
  }

  // -----------------------------
  // Testing
  // -----------------------------

  const hasTests =
    Array.from(fileNames).some(
      (name) =>
        name.includes("test") ||
        name.includes("jest") ||
        name.includes("vitest") ||
        name.includes("playwright")
    );

  if (!hasTests) {
    testing.push({
      title: "Add Automated Tests",
      description:
        "Introduce automated tests for important repository functionality to improve reliability and prevent regressions.",
      priority: "Medium",
    });
  }

  // -----------------------------
  // Security
  // -----------------------------

  if (!fileNames.has("security.md")) {
    security.push({
      title: "Add Security Policy",
      description:
        "Add a SECURITY.md file describing how security vulnerabilities should be reported and handled.",
      priority: "Low",
    });
  }

  // -----------------------------
  // Issues
  // -----------------------------

  if (repo.open_issues_count > 20) {
    bugs.push({
      title: "Review Open Issues",
      description:
        `The repository currently has ${repo.open_issues_count} open issues. Review, prioritize, and close outdated issues to improve issue management.`,
      priority: "Medium",
    });
  }

  // -----------------------------
  // Performance
  // -----------------------------

  performance.push({
    title: "Optimize Repository Data Fetching",
    description:
      "Review repository API requests and reduce unnecessary calls to improve analysis speed and API efficiency.",
    priority: "Low",
  });

  // -----------------------------
  // Features
  // -----------------------------

  features.push({
    title: "Add Repository Health History",
    description:
      "Store previous repository health scores so maintainers can track improvements and regressions over time.",
    priority: "Low",
  });

  // -----------------------------
  // UI/UX
  // -----------------------------

  uiux.push({
    title: "Improve Issue Suggestion Filtering",
    description:
      "Allow contributors to filter suggested issues by category and priority.",
    priority: "Low",
  });

  // -----------------------------
  // Accessibility
  // -----------------------------

  accessibility.push({
    title: "Improve Keyboard Navigation",
    description:
      "Ensure repository analysis controls and issue suggestion actions can be fully operated using the keyboard.",
    priority: "Medium",
  });

  const categories: IssueCategory[] = [
    {
      id: "features",
      icon: "✨",
      title: "New Features",
      description:
        "Potential functionality that could make the project more useful.",
      issues: features,
    },
    {
      id: "bugs",
      icon: "🐛",
      title: "Bugs",
      description:
        "Potential problems that could affect reliability or user experience.",
      issues: bugs,
    },
    {
      id: "documentation",
      icon: "📚",
      title: "Documentation",
      description:
        "Documentation improvements that could make the project easier to understand and contribute to.",
      issues: documentation,
    },
    {
      id: "uiux",
      icon: "🎨",
      title: "UI/UX",
      description:
        "Ideas for improving usability and the overall interface.",
      issues: uiux,
    },
    {
      id: "performance",
      icon: "⚡",
      title: "Performance",
      description:
        "Potential improvements for faster repository analysis and a smoother experience.",
      issues: performance,
    },
    {
      id: "testing",
      icon: "🧪",
      title: "Testing",
      description:
        "Testing improvements that can make the project more reliable.",
      issues: testing,
    },
    {
      id: "security",
      icon: "🔒",
      title: "Security",
      description:
        "Potential improvements for protecting the project and its users.",
      issues: security,
    },
    {
      id: "accessibility",
      icon: "♿",
      title: "Accessibility",
      description:
        "Improvements that can make the project easier to use for everyone.",
      issues: accessibility,
    },
  ];

  return categories.filter((category) => category.issues.length > 0);
}

export async function POST(request: Request) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl || typeof repoUrl !== "string") {
      return NextResponse.json(
        {
          error: "Repository URL is required.",
        },
        {
          status: 400,
        }
      );
    }

    const repository = extractGitHubRepository(repoUrl);

    if (!repository) {
      return NextResponse.json(
        {
          error: "Please provide a valid public GitHub repository URL.",
        },
        {
          status: 400,
        }
      );
    }

    const { owner, repo } = repository;

    // Get repository information
    const repoData = await githubFetch<GitHubRepo>(
      `https://api.github.com/repos/${owner}/${repo}`
    );

    // Get repository root files
    const rootFiles = await githubFetch<GitHubContent[]>(
      `https://api.github.com/repos/${owner}/${repo}/contents?ref=${encodeURIComponent(
        repoData.default_branch
      )}`
    );

    // Generate suggestions without using AI
    const suggestions = createRuleBasedSuggestions(
      repoData,
      rootFiles
    );

    // Try Groq only as an enhancement.
    // If Groq fails, the rule-based suggestions are still returned.
    try {
      if (process.env.GROQ_API_KEY) {
        const problems = suggestions.flatMap((category) =>
          category.issues.map((issue) => ({
            category: category.title,
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
          }))
        );

        const prompt = `
You are RepoSheriff, a GitHub repository intelligence assistant.

Repository:
${repoData.full_name}

Description:
${repoData.description || "No description provided"}

Detected repository problems:
${JSON.stringify(problems, null, 2)}

Improve these suggestions.

Rules:
1. Only improve the provided suggestions.
2. Do not invent repository facts.
3. Keep the same categories.
4. Keep priority as High, Medium, or Low.
5. Return ONLY valid JSON.
6. Return an array called "categories".

Expected structure:

{
  "categories": [
    {
      "id": "documentation",
      "icon": "📚",
      "title": "Documentation",
      "description": "Documentation improvements.",
      "issues": [
        {
          "title": "Add Contributor Guide",
          "description": "Clear actionable description.",
          "priority": "Medium"
        }
      ]
    }
  ]
}
`;

        const response = await groq.chat.completions.create({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Return only valid JSON. Do not use markdown or code fences.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.2,
          max_completion_tokens: 2048,
          response_format: {
            type: "json_object",
          },
        });

        const content =
          response.choices?.[0]?.message?.content;

        if (content) {
          const parsed = JSON.parse(content);

          if (Array.isArray(parsed.categories)) {
            return NextResponse.json({
              repoName: repoData.full_name,
              categories: parsed.categories,
              aiEnhanced: true,
            });
          }
        }
      }
    } catch (error) {
      console.warn(
        "Groq enhancement unavailable. Using rule-based suggestions.",
        error
      );
    }

    return NextResponse.json({
      repoName: repoData.full_name,
      categories: suggestions,
      aiEnhanced: false,
    });
  } catch (error) {
    console.error("Issue Suggestions API error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate issue suggestions.",
      },
      {
        status: 503,
      }
    );
  }
}