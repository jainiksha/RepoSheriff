import { NextResponse } from "next/server";

// ======================================================
// GROQ CONFIGURATION
// ======================================================

const GROQ_MODEL = "llama-3.3-70b-versatile";

async function groqChat(
  prompt: string,
  jsonMode: boolean = false
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  // For JSON responses, explicitly tell Groq to return JSON.
  // Normal Wizard chat does not use JSON response mode.
  const finalPrompt = jsonMode
    ? `${prompt}

IMPORTANT:
Return the response as valid JSON only.
Use JSON format.
Do not use markdown.
Do not use code fences.`
    : prompt;

  const requestBody: Record<string, unknown> = {
    model: GROQ_MODEL,

    messages: [
      {
        role: "user",
        content: finalPrompt,
      },
    ],

    temperature: 0.2,
  };

  // Only enable Groq's JSON response format when needed.
  if (jsonMode) {
    requestBody.response_format = {
      type: "json_object",
    };
  }

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },

      body: JSON.stringify(requestBody),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("Groq API error:", data);

    throw new Error(
      data?.error?.message ||
        `Groq API request failed with status ${response.status}.`
    );
  }

  return data?.choices?.[0]?.message?.content || "";
}

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
// GENERATE INTERVIEW QUESTIONS
// ======================================================

async function generateInterviewQuestions(
  repositoryContext: string
): Promise<InterviewQuestions> {
  const prompt = `
You are RepoSheriff's AI technical interviewer.

Your job is to create interview preparation material
for the GitHub repository described below.

IMPORTANT:
Use ONLY the repository information provided in this prompt.

Do not invent technologies.
Do not assume frameworks that are not mentioned.
Do not create questions unrelated to this repository.

==================================================
REPOSITORY INFORMATION
==================================================

${repositoryContext}

==================================================
TASK
==================================================

Generate exactly 40 interview question-answer pairs.

Divide them into exactly four difficulty levels:

EASY:
10 questions

MEDIUM:
10 questions

ADVANCED:
10 questions

CRITICAL:
10 questions

==================================================
EASY QUESTIONS
==================================================

Focus on basic repository understanding:

- project purpose
- problem solved
- main features
- technologies
- programming languages
- basic functionality
- target users
- important repository files

==================================================
MEDIUM QUESTIONS
==================================================

Focus on implementation:

- APIs
- components
- libraries
- data flow
- frontend/backend communication
- repository structure
- technical implementation
- authentication
- configuration

==================================================
ADVANCED QUESTIONS
==================================================

Focus on deeper engineering:

- architecture
- scalability
- performance
- error handling
- maintainability
- system design
- API design
- deployment
- data management

==================================================
CRITICAL QUESTIONS
==================================================

Focus on challenging interviewer-level questions:

- security
- scalability
- production problems
- failure scenarios
- API rate limits
- performance bottlenecks
- architecture redesign
- cost optimization
- large-scale usage
- difficult technical decisions

==================================================
ANSWER REQUIREMENTS
==================================================

Every question MUST have an answer.

Answers should:
- be technically accurate
- be understandable
- be specific to this repository
- explain reasoning where appropriate
- avoid unnecessary information

Do not make answers extremely short.

==================================================
OUTPUT FORMAT
==================================================

Return ONLY valid JSON.

Use exactly this structure:

{
  "easy": [
    {
      "question": "Question",
      "answer": "Answer"
    }
  ],
  "medium": [
    {
      "question": "Question",
      "answer": "Answer"
    }
  ],
  "advanced": [
    {
      "question": "Question",
      "answer": "Answer"
    }
  ],
  "critical": [
    {
      "question": "Question",
      "answer": "Answer"
    }
  ]
}

Rules:
- easy MUST contain exactly 10 objects.
- medium MUST contain exactly 10 objects.
- advanced MUST contain exactly 10 objects.
- critical MUST contain exactly 10 objects.
- Do not add another category.
- Do not remove any category.
- Do not use markdown.
- Do not use code fences.
- Return JSON only.
`;

  const response = await groqChat(prompt, true);

  let cleaned = response.trim();

  cleaned = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("AI did not return valid interview JSON.");
  }

  let parsed: unknown;

  try {
    parsed = JSON.parse(cleaned.slice(firstBrace, lastBrace + 1));
  } catch {
    throw new Error("AI returned malformed interview JSON.");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as Record<string, unknown>).easy) ||
    !Array.isArray((parsed as Record<string, unknown>).medium) ||
    !Array.isArray((parsed as Record<string, unknown>).advanced) ||
    !Array.isArray((parsed as Record<string, unknown>).critical)
  ) {
    throw new Error(
      "Interview response is missing required sections."
    );
  }

  const result = parsed as InterviewQuestions;

  if (
    result.easy.length !== 10 ||
    result.medium.length !== 10 ||
    result.advanced.length !== 10 ||
    result.critical.length !== 10
  ) {
    throw new Error(
      "AI did not generate exactly 10 questions for every level."
    );
  }

  const sections: Array<keyof InterviewQuestions> = [
    "easy",
    "medium",
    "advanced",
    "critical",
  ];

  for (const section of sections) {
    for (const item of result[section]) {
      if (
        !item ||
        typeof item.question !== "string" ||
        typeof item.answer !== "string" ||
        !item.question.trim() ||
        !item.answer.trim()
      ) {
        throw new Error(
          `Invalid question-answer pair in ${section} section.`
        );
      }
    }
  }

  return result;
}

// ======================================================
// GITHUB API HELPER
// ======================================================

async function githubFetch<T>(url: string): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",

    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Optional GitHub token.
  // Public repositories work without one.
  // A token provides higher GitHub API rate limits.
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
): {
  owner: string;
  repo: string;
} | null {
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
  // PROGRAMMING LANGUAGES
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
  // PACKAGE.JSON
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
  // PYTHON
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
  // JAVA
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
  // KOTLIN
  // ====================================================

  if (files["build.gradle.kts"]) {
    technologies.add("Kotlin");

    technologies.add("Gradle");
  }

  // ====================================================
  // RUST
  // ====================================================

  if (files["Cargo.toml"]) {
    technologies.add("Rust");

    technologies.add("Cargo");
  }

  // ====================================================
  // GO
  // ====================================================

  if (files["go.mod"]) {
    technologies.add("Go");
  }

  // ====================================================
  // PHP
  // ====================================================

  if (files["composer.json"]) {
    technologies.add("PHP");

    technologies.add("Composer");
  }

  // ====================================================
  // DOCKER
  // ====================================================

  if (
    files["Dockerfile"] ||
    files["docker-compose.yml"] ||
    files["docker-compose.yaml"]
  ) {
    technologies.add("Docker");
  }

  // ====================================================
  // TYPESCRIPT
  // ====================================================

  if (files["tsconfig.json"]) {
    technologies.add("TypeScript");
  }

  // ====================================================
  // NEXT.JS
  // ====================================================

  if (
    files["next.config.js"] ||
    files["next.config.mjs"]
  ) {
    technologies.add("Next.js");
  }

  // ====================================================
  // VITE
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
    const body = await request.json();

    const message =
      typeof body?.message === "string"
        ? body.message
        : "";

    const mode =
      typeof body?.mode === "string"
        ? body.mode
        : "";

    const repositoryInput =
      typeof body?.repository === "string"
        ? body.repository.trim()
        : "";

    // ==================================================
    // INTERVIEW MODE
    // ==================================================
    // The interview page can request questions directly.
    // It may send either a full GitHub URL or owner/repository.
    // We rebuild the repository context here so the questions
    // are based on the actual scanned repository.

    if (mode === "interview") {
      let githubUrl = repositoryInput;

      if (
        githubUrl &&
        !/^https?:\/\/\S+/i.test(githubUrl)
      ) {
        githubUrl = `https://github.com/${githubUrl.replace(/^\/+|\/+$/g, "")}`;
      }

      if (!githubUrl) {
        githubUrl = extractUrlFromMessage(message) || "";
      }

      const repository =
        extractGitHubRepository(githubUrl);

      if (!repository) {
        return NextResponse.json(
          {
            error:
              "A valid GitHub repository URL or owner/repository is required for the interview.",
          },
          {
            status: 400,
          }
        );
      }

      const { owner, repo } = repository;

      console.log(
        `Generating interview for GitHub repository: ${owner}/${repo}`
      );

      // Get repository information.
      const repoData =
        await githubFetch<GitHubRepo>(
          `https://api.github.com/repos/${owner}/${repo}`
        );

      // Get languages.
      const languages =
        await githubFetch<GitHubLanguages>(
          `https://api.github.com/repos/${owner}/${repo}/languages`
        );

      // Get root files.
      const rootFiles =
        await githubFetch<GitHubContent[]>(
          `https://api.github.com/repos/${owner}/${repo}/contents?ref=${encodeURIComponent(
            repoData.default_branch
          )}`
        );

      // Get important configuration files.
      const importantFiles =
        await getImportantFiles(
          owner,
          repo,
          repoData.default_branch,
          rootFiles
        );

      // Detect the actual technologies.
      const technologies =
        detectTechnologies(
          languages,
          importantFiles
        );

      const repositoryContext = `
Repository:
${repoData.full_name}

Description:
${repoData.description || "No description provided"}

Primary language:
${repoData.language || "Unknown"}

Default branch:
${repoData.default_branch}

GitHub languages:
${JSON.stringify(languages, null, 2)}

Detected technologies:
${JSON.stringify(technologies, null, 2)}

Repository statistics:
- Stars: ${repoData.stargazers_count}
- Forks: ${repoData.forks_count}
- Open issues: ${repoData.open_issues_count}

Important repository files and their contents:
${JSON.stringify(importantFiles, null, 2)}
`;

      const interviewQuestions =
        await generateInterviewQuestions(
          repositoryContext
        );

      return NextResponse.json({
        success: true,
        repoName: repoData.full_name,
        technologies,
        interviewQuestions,
      });
    }

    // ==================================================
    // NORMAL WIZARD / SCAN MODE
    // ==================================================

    if (!message) {
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
      // IMPORTANT:
      // Normal chat does NOT use JSON mode.
      const reply = await groqChat(
        message,
        false
      );

      return NextResponse.json({
        reply:
          reply ||
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
    // 9. BUILD REPOSITORY CONTEXT FOR INTERVIEW AI
    // ==================================================

    const repositoryContext = `
Repository:
${repoData.full_name}

Description:
${repoData.description || "No description provided"}

Primary language:
${repoData.language || "Unknown"}

Default branch:
${repoData.default_branch}

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

Important repository files and their contents:
${JSON.stringify(
  importantFiles,
  null,
  2
)}
`;

    // ==================================================
    // 10. GENERATE 40 INTERVIEW QUESTIONS
    // ==================================================

    const interviewQuestions =
      await generateInterviewQuestions(
        repositoryContext
      );

    // ==================================================
    // 11. ASK GROQ TO ANALYZE REPOSITORY
    // ==================================================

    const analysisPrompt = `
You are RepoSheriff, a GitHub repository intelligence tool.

Analyze ONLY this repository.

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
9. Keep the summary concise.
10. Keep strengths and improvements practical.

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

    // ==================================================
    // 10. GROQ ANALYSIS
    // ==================================================

    // IMPORTANT:
    // Repository analysis DOES need JSON mode.
    const responseText =
      await groqChat(
        analysisPrompt,
        true
      );

    if (!responseText) {
      throw new Error(
        "Groq returned an empty response."
      );
    }

    // ==================================================
    // 11. CLEAN RESPONSE
    // ==================================================

    let reply =
      responseText.trim();

    reply = reply
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    // ==================================================
    // 12. VALIDATE JSON
    // ==================================================

    try {
      const parsed =
        JSON.parse(reply) as ScanResult;

      // Force actual detected technologies.
      parsed.technologies =
        technologies;

      // Make sure score is valid.
      if (
        typeof parsed.score !== "number"
      ) {
        parsed.score = 0;
      }

      parsed.score = Math.max(
        0,
        Math.min(
          100,
          parsed.score
        )
      );

      // Make sure required fields exist.
      parsed.repoName =
        parsed.repoName ||
        repoData.full_name;

      parsed.summary =
        parsed.summary ||
        "Repository analysis completed.";

      parsed.projectDescription =
        parsed.projectDescription ||
        repoData.description ||
        "No project description available.";

      parsed.strengths =
        Array.isArray(
          parsed.strengths
        )
          ? parsed.strengths
          : [];

      parsed.improvements =
        Array.isArray(
          parsed.improvements
        )
          ? parsed.improvements
          : [];

      // ==================================================
      // RETURN RESULT
      // ==================================================

      return NextResponse.json({
        reply: JSON.stringify(parsed),

        technologies,

        interviewQuestions,
      });
    } catch (parseError) {
      console.error(
        "Groq returned invalid JSON:",
        reply
      );

      console.error(
        "JSON parse error:",
        parseError
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