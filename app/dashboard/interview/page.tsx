"use client";

import { useEffect, useState } from "react";

type Question = {
  question: string;
  answer: string;
};

type InterviewData = {
  easy: Question[];
  medium: Question[];
  advanced: Question[];
  critical: Question[];
};

const levels = [
  {
    key: "easy" as const,
    label: "Easy",
    description: "Basic questions about your repository and project.",
  },
  {
    key: "medium" as const,
    label: "Medium",
    description:
      "Questions about implementation, architecture and technologies.",
  },
  {
    key: "advanced" as const,
    label: "Advanced",
    description: "Deep technical questions about your repository.",
  },
  {
    key: "critical" as const,
    label: "Critical",
    description:
      "Challenging questions that test your technical decisions.",
  },
];

export default function InterviewPage() {
  const [interviewData, setInterviewData] =
    useState<InterviewData | null>(null);

  const [activeLevel, setActiveLevel] =
    useState<keyof InterviewData>("easy");

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [loading, setLoading] = useState(true);

  /* =====================================================
     LOAD GENERATED INTERVIEW QUESTIONS
  ====================================================== */

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("reposheriff-interview");

      if (!saved) {
        console.log(
          "No interview questions found in sessionStorage."
        );

        setLoading(false);
        return;
      }

      const parsed = JSON.parse(saved) as InterviewData;

      setInterviewData(parsed);
    } catch (error) {
      console.error(
        "Error loading interview questions:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     LOADING
  ====================================================== */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fffdf5]">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#e9e2cf] border-t-[#ffc515]" />

          <p className="mt-4 font-semibold text-[#111111]">
            Loading interview questions...
          </p>
        </div>
      </main>
    );
  }

  /* =====================================================
     NO DATA
  ====================================================== */

  if (!interviewData) {
    return (
      <main className="min-h-screen bg-[#fffdf5] text-[#111111]">

        {/* HEADER */}

        <section className="border-b border-[#e9e2cf] bg-[#ffc515]">
          <div className="mx-auto max-w-6xl px-6 py-16">

            <p className="text-sm font-bold uppercase tracking-[2px] text-[#735800]">
              RepoSheriff Interview
            </p>

            <h1 className="mt-4 text-5xl font-bold">
              Defend your repository.
            </h1>

            <p className="mt-4 max-w-2xl text-[#5f531f]">
              Scan a repository first to generate
              repository-specific interview questions.
            </p>

          </div>
        </section>

        {/* MESSAGE */}

        <section className="mx-auto max-w-3xl px-6 py-20">

          <div className="rounded-3xl border border-[#e9e2cf] bg-white p-10 text-center shadow-lg">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3c4] text-3xl">
              ?
            </div>

            <h2 className="mt-6 text-3xl font-bold">
              No interview questions found
            </h2>

            <p className="mt-4 leading-7 text-[#6b685f]">
              Please go back to the dashboard and scan
              a GitHub repository first.
            </p>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/dashboard";
              }}
              className="mt-7 rounded-xl bg-[#ffc515] px-7 py-3 font-bold transition hover:bg-[#edb500]"
            >
              Scan Repository
            </button>

          </div>

        </section>

      </main>
    );
  }

  /* =====================================================
     CURRENT QUESTIONS
  ====================================================== */

  const questions =
    interviewData[activeLevel] || [];

  const question =
    questions[currentQuestion];

  /* =====================================================
     CHANGE DIFFICULTY
  ====================================================== */

  const changeLevel = (
    level: keyof InterviewData
  ) => {
    setActiveLevel(level);
    setCurrentQuestion(0);
  };

  /* =====================================================
     NEXT QUESTION
  ====================================================== */

  const handleNext = () => {
    if (
      currentQuestion <
      questions.length - 1
    ) {
      setCurrentQuestion(
        currentQuestion + 1
      );
    } else {
      alert(
        `${activeLevel.toUpperCase()} level completed!`
      );
    }
  };

  /* =====================================================
     PREVIOUS QUESTION
  ====================================================== */

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(
        currentQuestion - 1
      );
    }
  };

  /* =====================================================
     PROGRESS
  ====================================================== */

  const progress =
    questions.length > 0
      ? ((currentQuestion + 1) /
          questions.length) *
        100
      : 0;

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111]">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="border-b border-[#e9e2cf] bg-[#ffc515]">

        <div className="mx-auto max-w-6xl px-6 py-14">

          <p className="text-sm font-bold uppercase tracking-[2px] text-[#735800]">
            RepoSheriff Interview
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Defend your repository.
          </h1>

          <p className="mt-4 max-w-2xl text-lg text-[#5f531f]">
            Practice AI-generated questions based on
            your GitHub repository.
          </p>

        </div>

      </section>


      {/* =================================================
          MAIN
      ================================================= */}

      <section className="mx-auto max-w-5xl px-6 py-14">

        {/* =================================================
            DIFFICULTY LEVELS
        ================================================= */}

        <div className="grid gap-4 md:grid-cols-4">

          {levels.map((level) => {

            const count =
              interviewData[level.key]?.length || 0;

            const active =
              activeLevel === level.key;

            return (
              <button
                type="button"
                key={level.key}
                onClick={() =>
                  changeLevel(level.key)
                }
                className={`rounded-2xl border p-5 text-left transition ${
                  active
                    ? "border-[#ffc515] bg-[#fff3c4] shadow-md"
                    : "border-[#e9e2cf] bg-white hover:-translate-y-1 hover:shadow-md"
                }`}
              >

                <div>
                <span className="text-xs font-bold uppercase text-[#b28700]">
                    {level.label}
                </span>
                </div>

                <h2 className="mt-4 text-xl font-bold">
                  {level.label}
                </h2>

                <p className="mt-2 text-sm leading-6 text-[#6b685f]">
                  {level.description}
                </p>

              </button>
            );
          })}

        </div>


        {/* =================================================
            QUESTION CARD
        ================================================== */}

        {question ? (

          <div className="mt-10 rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-xl md:p-10">

            {/* QUESTION HEADER */}

            <div className="flex items-center justify-between">

              <span className="text-xs font-bold uppercase tracking-[2px] text-[#b28700]">
                Question{" "}
                {currentQuestion + 1} /{" "}
                {questions.length}
              </span>

              <span className="rounded-full border border-[#e9d99d] bg-[#fff3c4] px-4 py-2 text-xs font-bold uppercase text-[#9a7400]">
                {activeLevel}
              </span>

            </div>


            {/* QUESTION */}

            <h2 className="mt-8 text-3xl font-bold leading-tight md:text-4xl">
              {question.question}
            </h2>

            <p className="mt-4 text-[#6b685f]">
              This question is based on your scanned
              GitHub repository.
            </p>


            {/* =================================================
                SUGGESTED ANSWER
            ================================================== */}

            <div className="mt-8 rounded-2xl border border-[#e9d99d] bg-[#fff8d9] p-6">

              <p className="text-xs font-bold uppercase tracking-[2px] text-[#9a7400]">
                Suggested Answer
              </p>

              <p className="mt-4 whitespace-pre-line text-base leading-8 text-[#4f4c45]">
                {question.answer}
              </p>

            </div>


            {/* =================================================
                CONTROLS
            ================================================== */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">

              {/* PREVIOUS */}

              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="rounded-xl border border-[#e9e2cf] bg-white px-6 py-3 font-semibold transition hover:bg-[#fffdf5] disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Previous
              </button>


              {/* NEXT */}

              <button
                type="button"
                onClick={handleNext}
                className="rounded-xl bg-[#ffc515] px-7 py-3 font-bold text-[#111111] transition hover:bg-[#edb500]"
              >
                {currentQuestion ===
                questions.length - 1
                  ? "Finish Level"
                  : "Next Question →"}
              </button>

            </div>

          </div>

        ) : (

          /* =================================================
             NO QUESTIONS
          ================================================== */

          <div className="mt-10 rounded-3xl border border-[#e9e2cf] bg-white p-10 text-center">

            <h2 className="text-2xl font-bold">
              No questions available
            </h2>

            <p className="mt-3 text-[#6b685f]">
              This difficulty level does not contain
              generated questions yet.
            </p>

          </div>

        )}


        {/* =================================================
            PROGRESS
        ================================================== */}

        {questions.length > 0 && (

          <div className="mt-8">

            <div className="mb-3 flex justify-between text-xs font-semibold text-[#77736a]">

              <span>
                {activeLevel} progress
              </span>

              <span>
                {currentQuestion + 1} /{" "}
                {questions.length}
              </span>

            </div>

            <div className="h-2 overflow-hidden rounded-full bg-[#eee9dc]">

              <div
                className="h-full rounded-full bg-[#ffc515] transition-all duration-300"
                style={{
                  width: `${progress}%`,
                }}
              />

            </div>

          </div>

        )}

      </section>


      {/* =================================================
          FOOTER
      ================================================== */}

      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">
        RepoSheriff — AI-powered repository interview preparation
      </footer>

    </main>
  );
}