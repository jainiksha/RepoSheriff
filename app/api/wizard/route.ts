import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ======================================================
// TYPES
// ======================================================

type GitHubRepo = {
  full_name: string;
  name: string;
  owner: {
    login: string;
  };
  description: string | null;
  default_branch: string;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
};

type GitHubLanguages = Record<string, number>;

type GitHubContent = {
  name: string;
  path: string;
  type: string;
  download_url?: string | null;
};

type ScanResult = {
  repoName: string;
  score: number;
  summary: string;
  projectDescription: string;
  technologies: string[];
  strengths: string[];
  improvements: string[];
  checks: {
    README: "Passed" | "Warning";
    License: "Passed" | "Warning";
    "Recent activity": "Passed" | "Warning";
    Description: "Passed" | "Warning";
    "Open issues": "Passed" | "Warning";
    "Community health": "Passed" | "Warning";
  };
};

// ======================================================
// GITHUB API HELPER
// ======================================================

async function githubFetch<T>(url: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Optional GitHub token.
  // Public repositories work without it, but a token gives
  // higher API rate limits.
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

// ======================================================
// EXTRACT GITHUB OWNER + REPOSITORY
// ======================================================

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

    const parts = parsed.pathname
      .split("/")
      .filter(Boolean);

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

// ======================================================
// GET IMPORTANT REPOSITORY FILES
// ======================================================

async function getImportantFiles(
  owner: string,
  repo: string,
  branch: string,
  rootFiles: GitHubContent[]
): Promise<Record<string, string>> {
  const importantFileNames = [
    "package.json",
    "requirements.txt",
    "pyproject.toml",
    "Pipfile",
    "pom.xml",
    "build.gradle",
    "build.gradle.kts",
    "Cargo.toml",
    "go.mod",
    "composer.json",
    "Dockerfile",
    "docker-compose.yml",
    "docker-compose.yaml",
    "tsconfig.json",
    "next.config.js",
    "next.config.mjs",
    "vite.config.js",
    "vite.config.ts",
  ];

  const files: Record<string, string> = {};

  for (const file of rootFiles) {
    if (
      file.type !== "file" ||
      !importantFileNames.includes(file.name)
    ) {
      continue;
    }

    try {
      const content = await githubFetch<{
        content?: string;
        encoding?: string;
      }>(
        `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(
          file.path
        )}?ref=${encodeURIComponent(branch)}`
      );

      if (content.content) {
        const decoded = Buffer.from(
          content.content.replace(/\n/g, ""),
          "base64"
        ).toString("utf-8");

        files[file.name] = decoded;
      }
    } catch (error) {
      console.warn(
        `Could not read ${file.name}:`,
        error
      );
    }
  }

  return files;
}

// ======================================================
// DETECT TECHNOLOGIES
// ======================================================

function detectTechnologies(
  languages: Record<string, number>,
  files: Record<string, string>
): string[] {
  const technologies = new Set<string>();

  // ====================================================
  // 1. PROGRAMMING LANGUAGES
  // ====================================================

  const languageMap: Record<string, string> = {
    JavaScript: "JavaScript",
    TypeScript: "TypeScript",
    Python: "Python",
    Java: "Java",
    "C++": "C++",
    "C#": "C#",
    C: "C",
    Go: "Go",
    Rust: "Rust",
    PHP: "PHP",
    Ruby: "Ruby",
    Kotlin: "Kotlin",
    Swift: "Swift",
    Dart: "Dart",
    HTML: "HTML",
    CSS: "CSS",
    Shell: "Shell",
  };

  Object.keys(languages).forEach((language) => {
    if (languageMap[language]) {
      technologies.add(languageMap[language]);
    }
  });

  // ====================================================
  // 2. PACKAGE.JSON
  // ====================================================

  const packageJson = files["package.json"];

  if (packageJson) {
    try {
      const pkg = JSON.parse(packageJson);

      const dependencies = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      };

      const dependencyNames = Object.keys(dependencies);

      // React
      if (
        dependencyNames.includes("react") ||
        dependencyNames.includes("react-dom")
      ) {
        technologies.add("React");
      }

      // Next.js
      if (dependencyNames.includes("next")) {
        technologies.add("Next.js");
      }

      // Vue
      if (
        dependencyNames.includes("vue") ||
        dependencyNames.includes("nuxt")
      ) {
        technologies.add("Vue.js");
      }

      // Angular
      if (
        dependencyNames.includes("@angular/core")
      ) {
        technologies.add("Angular");
      }

      // Tailwind
      if (
        dependencyNames.includes("tailwindcss")
      ) {
        technologies.add("Tailwind CSS");
      }

      // Express
      if (
        dependencyNames.includes("express")
      ) {
        technologies.add("Express.js");
      }

      // Node.js
      if (
        dependencyNames.includes("node") ||
        dependencyNames.includes("@types/node")
      ) {
        technologies.add("Node.js");
      }

      // Vite
      if (
        dependencyNames.includes("vite")
      ) {
        technologies.add("Vite");
      }

      // Redux
      if (
        dependencyNames.includes("redux") ||
        dependencyNames.includes("@reduxjs/toolkit")
      ) {
        technologies.add("Redux");
      }

      // Prisma
      if (
        dependencyNames.includes("prisma") ||
        dependencyNames.includes("@prisma/client")
      ) {
        technologies.add("Prisma");
      }

      // MongoDB
      if (
        dependencyNames.includes("mongodb") ||
        dependencyNames.includes("mongoose")
      ) {
        technologies.add("MongoDB");
      }

      // Firebase
      if (
        dependencyNames.includes("firebase")
      ) {
        technologies.add("Firebase");
      }

      // Supabase
      if (
        dependencyNames.some((name) =>
          name.includes("supabase")
        )
      ) {
        technologies.add("Supabase");
      }

      // Axios
      if (
        dependencyNames.includes("axios")
      ) {
        technologies.add("Axios");
      }

      // GraphQL
      if (
        dependencyNames.includes("graphql") ||
        dependencyNames.includes("@apollo/client")
      ) {
        technologies.add("GraphQL");
      }

      // Jest
      if (
        dependencyNames.includes("jest")
      ) {
        technologies.add("Jest");
      }

      // Playwright
      if (
        dependencyNames.includes("@playwright/test") ||
        dependencyNames.includes("playwright")
      ) {
        technologies.add("Playwright");
      }

      // ESLint
      if (
        dependencyNames.includes("eslint")
      ) {
        technologies.add("ESLint");
      }

      // Prettier
      if (
        dependencyNames.includes("prettier")
      ) {
        technologies.add("Prettier");
      }
    } catch (error) {
      console.warn(
        "Could not parse package.json:",
        error
      );
    }
  }

  // ====================================================
  // 3. PYTHON
  // ====================================================

  if (files["requirements.txt"]) {
    technologies.add("Python");
  }

  if (files["pyproject.toml"]) {
    technologies.add("Python");
  }

  if (files["Pipfile"]) {
    technologies.add("Python");
  }

  // ====================================================
  // 4. JAVA
  // ====================================================

  if (files["pom.xml"]) {
    technologies.add("Java");
    technologies.add("Maven");
  }

  if (files["build.gradle"]) {
    technologies.add("Java");
    technologies.add("Gradle");
  }

  // ====================================================
  // 5. KOTLIN
  // ====================================================

  if (files["build.gradle.kts"]) {
    technologies.add("Kotlin");
    technologies.add("Gradle");
  }

  // ====================================================
  // 6. RUST
  // ====================================================

  if (files["Cargo.toml"]) {
    technologies.add("Rust");
    technologies.add("Cargo");
  }

  // ====================================================
  // 7. GO
  // ====================================================

  if (files["go.mod"]) {
    technologies.add("Go");
  }

  // ====================================================
  // 8. PHP
  // ====================================================

  if (files["composer.json"]) {
    technologies.add("PHP");
    technologies.add("Composer");
  }

  // ====================================================
  // 9. DOCKER
  // ====================================================

  if (
    files["Dockerfile"] ||
    files["docker-compose.yml"] ||
    files["docker-compose.yaml"]
  ) {
    technologies.add("Docker");
  }

  // ====================================================
  // 10. TYPESCRIPT CONFIG
  // ====================================================

  if (files["tsconfig.json"]) {
    technologies.add("TypeScript");
  }

  // ====================================================
  // 11. NEXT.JS CONFIG
  // ====================================================

  if (
    files["next.config.js"] ||
    files["next.config.mjs"]
  ) {
    technologies.add("Next.js");
  }

  // ====================================================
  // 12. VITE CONFIG
  // ====================================================

  if (
    files["vite.config.js"] ||
    files["vite.config.ts"]
  ) {
    technologies.add("Vite");
  }

  return Array.from(technologies);
}

// ======================================================
// FIND GITHUB URL INSIDE MESSAGE
// ======================================================

function extractUrlFromMessage(
  message: string
): string | null {
  const match = message.match(
    /https?:\/\/(?:www\.)?github\.com\/[\w.-]+\/[\w.-]+/i
  );

  return match ? match[0] : null;
}

// ======================================================
// POST
// ======================================================

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (
      !message ||
      typeof message !== "string"
    ) {
      return NextResponse.json(
        {
          error: "Message is required.",
        },
        {
          status: 400,
        }
      );
    }

    // ==================================================
    // 1. FIND GITHUB URL
    // ==================================================

    const githubUrl =
      extractUrlFromMessage(message);

    // ==================================================
    // 2. NORMAL WIZARD CHAT
    // ==================================================

    if (!githubUrl) {
      let response;

      for (
        let attempt = 1;
        attempt <= 3;
        attempt++
      ) {
        try {
          response =
            await ai.models.generateContent({
              model: "gemini-3.6-flash",
              contents: message,
            });

          break;
        } catch (error: unknown) {
          console.error(
            `Gemini attempt ${attempt} failed:`,
            error
          );

          const status =
            (
              error as Error & {
                status?: number;
              }
            )?.status;

          if (
            status !== 503 &&
            status !== 500 &&
            status !== 429
          ) {
            throw error;
          }

          if (attempt === 3) {
            throw error;
          }

          await new Promise((resolve) =>
            setTimeout(
              resolve,
              attempt * 1000
            )
          );
        }
      }

      return NextResponse.json({
        reply:
          response?.text ||
          "I couldn't generate a response.",
      });
    }

    // ==================================================
    // 3. EXTRACT OWNER + REPOSITORY
    // ==================================================

    const repository =
      extractGitHubRepository(githubUrl);

    if (!repository) {
      return NextResponse.json(
        {
          error:
            "Please provide a valid public GitHub repository URL.",
        },
        {
          status: 400,
        }
      );
    }

    const {
      owner,
      repo,
    } = repository;

    console.log(
      `Analyzing GitHub repository: ${owner}/${repo}`
    );

    // ==================================================
    // 4. GET REPOSITORY
    // ==================================================

    const repoData =
      await githubFetch<GitHubRepo>(
        `https://api.github.com/repos/${owner}/${repo}`
      );

    // ==================================================
    // 5. GET LANGUAGES
    // ==================================================

    const languages =
      await githubFetch<GitHubLanguages>(
        `https://api.github.com/repos/${owner}/${repo}/languages`
      );

    // ==================================================
    // 6. GET ROOT FILES
    // ==================================================

    const rootFiles =
      await githubFetch<GitHubContent[]>(
        `https://api.github.com/repos/${owner}/${repo}/contents?ref=${encodeURIComponent(
          repoData.default_branch
        )}`
      );

    // ==================================================
    // 7. GET IMPORTANT FILE CONTENT
    // ==================================================

    const importantFiles =
      await getImportantFiles(
        owner,
        repo,
        repoData.default_branch,
        rootFiles
      );

    // ==================================================
    // 8. DETECT TECHNOLOGIES
    // ==================================================

    const technologies =
      detectTechnologies(
        languages,
        importantFiles
      );

    console.log(
      "Detected technologies:",
      technologies
    );

    // ==================================================
    // 9. ASK GEMINI TO ANALYZE REPOSITORY
    // ==================================================

    const analysisPrompt = `
You are RepoSheriff, a GitHub repository intelligence tool.

Analyze ONLY this repository:

Repository:
${repoData.full_name}

Description:
${repoData.description || "No description provided"}

Primary language:
${repoData.language || "Unknown"}

GitHub languages:
${JSON.stringify(
  languages,
  null,
  2
)}

Detected technologies:
${JSON.stringify(
  technologies,
  null,
  2
)}

Repository statistics:
- Stars: ${repoData.stargazers_count}
- Forks: ${repoData.forks_count}
- Open issues: ${repoData.open_issues_count}

IMPORTANT RULES:

1. Analyze THIS repository only.
2. Do not use RepoSheriff's own technology stack.
3. Do not reuse information from previous repository scans.
4. The technologies array MUST represent this repository.
5. Do not invent technologies that are not supported by the provided repository information.
6. Return ONLY valid JSON.
7. Do not use markdown.
8. Do not put JSON inside code fences.

Return EXACTLY this structure:

{
  "repoName": "${repoData.full_name}",
  "score": 85,
  "summary": "Short repository health summary.",
  "projectDescription": "Explain what this project appears to do based on the repository information.",
  "technologies": ${JSON.stringify(
    technologies
  )},
  "strengths": [
    "Repository strength 1",
    "Repository strength 2"
  ],
  "improvements": [
    "Improvement 1",
    "Improvement 2"
  ],
  "checks": {
    "README": "Passed",
    "License": "Passed",
    "Recent activity": "Passed",
    "Description": "Passed",
    "Open issues": "Warning",
    "Community health": "Passed"
  }
}

Rules for score:
- score must be a number from 0 to 100.
- Each check must be exactly "Passed" or "Warning".
- technologies must remain based on the detected repository technologies.
`;

    let response;

    // ==================================================
    // 10. GEMINI RETRY
    // ==================================================

    for (
      let attempt = 1;
      attempt <= 3;
      attempt++
    ) {
      try {
        response =
          await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: analysisPrompt,
          });

        break;
      } catch (error: unknown) {
        console.error(
          `Gemini attempt ${attempt} failed:`,
          error
        );

        const status =
          (
            error as Error & {
              status?: number;
            }
          )?.status;

        if (
          status !== 503 &&
          status !== 500 &&
          status !== 429
        ) {
          throw error;
        }

        if (attempt === 3) {
          throw error;
        }

        await new Promise((resolve) =>
          setTimeout(
            resolve,
            attempt * 1000
          )
        );
      }
    }

    // ==================================================
    // 11. RETURN RESULT
    // ==================================================

    let reply =
      response?.text ||
      "";

    reply = reply
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // Make sure response is valid JSON.
    try {
      const parsed: ScanResult =
        JSON.parse(reply);

      // Force actual detected technologies.
      parsed.technologies =
        technologies;

      return NextResponse.json({
        reply: JSON.stringify(parsed),
        technologies,
      });
    } catch {
      console.error(
        "Gemini returned invalid JSON:",
        reply
      );

      return NextResponse.json(
        {
          error:
            "Repository analysis completed, but the AI response was invalid.",
        },
        {
          status: 500,
        }
      );
    }
  } catch (error) {
    console.error(
      "Wizard API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Wizard is temporarily unavailable. Please try again.",
      },
      {
        status: 503,
      }
    );
  }
}