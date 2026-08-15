import { NextRequest, NextResponse } from "next/server";

type Check = {
  name: string;
  status: "Passed" | "Warning";
  message: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    const match = url.match(
      /^https?:\/\/github\.com\/([^/]+)\/([^/#?]+)\/?$/
    );

    if (!match) {
      return NextResponse.json(
        { error: "Please provide a valid GitHub repository URL" },
        { status: 400 }
      );
    }

    const [, owner, repo] = match;

    const headers = {
      Accept: "application/vnd.github+json",
    };

    // Get repository information
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      { headers }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Repository not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: "Failed to fetch repository information" },
        { status: response.status }
      );
    }

    const repository = await response.json();

    // --------------------------------------------------
    // Repository checks
    // --------------------------------------------------

    const checks: Check[] = [];

    // 1. Description
    if (repository.description) {
      checks.push({
        name: "Description",
        status: "Passed",
        message: "Repository has a description.",
      });
    } else {
      checks.push({
        name: "Description",
        status: "Warning",
        message: "Repository does not have a description.",
      });
    }

    // 2. README
    const readmeResponse = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/readme`,
      { headers }
    );

    if (readmeResponse.ok) {
      checks.push({
        name: "README",
        status: "Passed",
        message: "Repository contains documentation.",
      });
    } else {
      checks.push({
        name: "README",
        status: "Warning",
        message: "Repository does not appear to have a README.",
      });
    }

    // 3. License
    if (repository.license) {
      checks.push({
        name: "License",
        status: "Passed",
        message: `Repository uses ${repository.license.name}.`,
      });
    } else {
      checks.push({
        name: "License",
        status: "Warning",
        message: "Repository does not have a detected license.",
      });
    }

    // 4. Open issues
    if (repository.open_issues_count <= 5) {
      checks.push({
        name: "Open issues",
        status: "Passed",
        message: `${repository.open_issues_count} open issues.`,
      });
    } else {
      checks.push({
        name: "Open issues",
        status: "Warning",
        message: `${repository.open_issues_count} open issues may need attention.`,
      });
    }

    // 5. Activity
    const updatedAt = new Date(repository.updated_at);
    const now = new Date();

    const daysSinceUpdate =
      (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate <= 90) {
      checks.push({
        name: "Recent activity",
        status: "Passed",
        message: "Repository has been updated recently.",
      });
    } else {
      checks.push({
        name: "Recent activity",
        status: "Warning",
        message: "Repository has not been updated recently.",
      });
    }

    // 6. Community health
    if (repository.has_issues || repository.has_wiki) {
      checks.push({
        name: "Community health",
        status: "Passed",
        message: "Repository has community features enabled.",
      });
    } else {
      checks.push({
        name: "Community health",
        status: "Warning",
        message: "Few community features are enabled.",
      });
    }

    // --------------------------------------------------
    // Calculate health score
    // --------------------------------------------------

    const passedChecks = checks.filter(
      (check) => check.status === "Passed"
    ).length;

    const score = Math.round((passedChecks / checks.length) * 100);

    let status: "Healthy" | "Needs Attention" | "Poor";

    if (score >= 80) {
      status = "Healthy";
    } else if (score >= 50) {
      status = "Needs Attention";
    } else {
      status = "Poor";
    }

    // --------------------------------------------------
    // Return result
    // --------------------------------------------------

    return NextResponse.json({
      success: true,

      repository: {
        name: repository.name,
        fullName: repository.full_name,
        description: repository.description,
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        openIssues: repository.open_issues_count,
        language: repository.language,
        defaultBranch: repository.default_branch,
        url: repository.html_url,
      },

      health: {
        score,
        status,
        checks,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}