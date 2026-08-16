import { NextResponse } from "next/server";

const GROQ_MODEL = "llama-3.3-70b-versatile";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      repoName,
      summary,
      score,
      checks,
    } = body;

    if (!repoName) {
      return NextResponse.json(
        {
          error: "Repository information is missing.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "GROQ_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const prompt = `
You are a professional software documentation writer.

Generate a complete and professional README.md for this GitHub repository.

Repository:
${repoName}

Repository summary:
${summary || "No summary available."}

Repository health score:
${score ?? "Not available"}

Repository checks:
${JSON.stringify(checks || {}, null, 2)}

Create the README using the following sections when the information is available:

# Project Title

## Overview

## Problem Statement

## Features

## Technology Stack

## Project Structure

## Installation

## Configuration

## Usage

## API

## How It Works

## Contributing

## Future Improvements

## License

IMPORTANT RULES:

1. Return ONLY Markdown.
2. Do not wrap the response inside a code block.
3. Do not invent technologies, APIs, databases, commands, features, or configuration values.
4. If information is not available, write "Not specified in the repository."
5. Keep the documentation professional and suitable for a GitHub repository.
6. Make the README easy for developers to understand.
`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },

        body: JSON.stringify({
          model: GROQ_MODEL,

          messages: [
            {
              role: "system",
              content:
                "You generate accurate GitHub README documentation.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],

          temperature: 0.3,

          max_tokens: 5000,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Groq API error:", errorText);

      return NextResponse.json(
        {
          error: "Failed to generate documentation using AI.",
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    const readme =
      data?.choices?.[0]?.message?.content?.trim();

    if (!readme) {
      return NextResponse.json(
        {
          error: "AI did not return any documentation.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      readme,
    });
  } catch (error) {
    console.error(
      "Documentation API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Documentation generation failed.",
      },
      { status: 500 }
    );
  }
}