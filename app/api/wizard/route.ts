import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 }
      );
    }

    let response;

    // Retry temporary Gemini errors
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: message,
        });

        break;
      } catch (error: any) {
        console.error(`Gemini attempt ${attempt} failed:`, error);

        const status = error?.status;

        // Retry only temporary server errors
        if (status !== 503 && status !== 500 && status !== 429) {
          throw error;
        }

        if (attempt === 3) {
          throw error;
        }

        // Wait 1s, then 2s before retrying
        const delay = attempt * 1000;

        await new Promise((resolve) =>
          setTimeout(resolve, delay)
        );
      }
    }

    return NextResponse.json({
      reply: response?.text || "I couldn't generate a response.",
    });
  } catch (error) {
    console.error("Wizard API error:", error);

    return NextResponse.json(
      {
        error:
          "Wizard is temporarily unavailable. Please try again in a moment.",
      },
      { status: 503 }
    );
  }
}