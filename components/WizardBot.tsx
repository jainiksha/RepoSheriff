"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "wizard";
  text: string;
};

export default function WizardBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (text?: string) => {
    const userMessage = (text ?? message).trim();

    if (!userMessage || isLoading) return;

    setMessage("");

    // Add user's message to chat
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("/api/wizard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Add Wizard's response
      setMessages((prev) => [
        ...prev,
        {
          role: "wizard",
          text: data.reply,
        },
      ]);
    } catch (error) {
      console.error("Wizard error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "wizard",
          text: "Sorry, I couldn't process your question right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Wizard Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#101214] shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>

                <h2 className="font-semibold text-white">
                  Wizard
                </h2>
              </div>

              <p className="text-xs text-zinc-500">
                RepoSheriff AI Assistant
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-xl text-zinc-400 transition hover:text-white"
              aria-label="Close Wizard"
            >
              ×
            </button>
          </div>

          {/* Chat Content */}
          <div className="h-[350px] overflow-y-auto p-4">

            {/* Initial Wizard Message */}
            <div className="mb-4 max-w-[90%] rounded-xl bg-zinc-900 p-3">
              <p className="text-sm leading-6 text-zinc-200">
                👋 Hi! I&apos;m Wizard.
              </p>

              <p className="mt-2 text-sm leading-6 text-zinc-400">
                I can help you understand your GitHub
                repository and RepoSheriff analysis.
              </p>
            </div>

            {/* Conversation Messages */}
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 max-w-[90%] rounded-xl p-3 ${
                  msg.role === "user"
                    ? "ml-auto bg-emerald-400/10 text-white"
                    : "mr-auto bg-zinc-900 text-zinc-200"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-6">
                  {msg.text}
                </p>
              </div>
            ))}

            {/* Loading */}
            {isLoading && (
              <div className="mb-3 mr-auto max-w-[90%] rounded-xl bg-zinc-900 p-3">
                <p className="text-sm text-zinc-400">
                  Wizard is thinking...
                </p>
              </div>
            )}

            {/* Suggested Questions */}
            {messages.length === 0 && !isLoading && (
              <div className="space-y-2">
                <p className="mb-2 text-xs text-zinc-500">
                  Try asking:
                </p>

                <button
                  onClick={() =>
                    handleSend("Why is my repository score important?")
                  }
                  className="w-full rounded-lg border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-emerald-500 hover:text-emerald-400"
                >
                  Why is my repository score important?
                </button>

                <button
                  onClick={() =>
                    handleSend("What does Open Issues mean?")
                  }
                  className="w-full rounded-lg border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-emerald-500 hover:text-emerald-400"
                >
                  What does Open Issues mean?
                </button>

                <button
                  onClick={() =>
                    handleSend("How can I improve my repository?")
                  }
                  className="w-full rounded-lg border border-zinc-800 px-3 py-2 text-left text-sm text-zinc-300 transition hover:border-emerald-500 hover:text-emerald-400"
                >
                  How can I improve my repository?
                </button>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-zinc-800 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2">

              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask Wizard anything..."
                disabled={isLoading}
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600 disabled:opacity-50"
              />

              <button
                onClick={() => handleSend()}
                disabled={!message.trim() || isLoading}
                className="text-lg text-emerald-400 transition hover:text-emerald-300 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Send message"
              >
                ➤
              </button>

            </div>
          </div>
        </div>
      )}

      {/* Floating Wizard Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-[#101214] text-2xl shadow-lg shadow-emerald-500/10 transition-all duration-200 hover:scale-105 hover:border-emerald-400 hover:shadow-emerald-500/20"
        aria-label="Open Wizard"
      >
        🤖
      </button>
    </>
  );
}