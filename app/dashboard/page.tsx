"use client";

import { useState } from "react";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");

  const handleScan = () => {
    if (!repoUrl.trim()) return;

    alert(`Scanning ${repoUrl}`);
  };

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111]">

      {/* Navigation */}
      <nav className="border-b border-[#e9e2cf] bg-[#ffc515]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-2">
            <img
              src="/reposheriff-logo.png"
              alt="RepoSheriff logo"
              className="h-16 w-28 object-contain"
            />

            <span className="text-xl font-bold tracking-tight text-[#111111]">
              RepoSheriff
            </span>
          </div>

          <div className="hidden gap-8 text-sm text-[#111111] md:flex">
            <span className="cursor-pointer hover:underline">
              How it works
            </span>

            <span className="cursor-pointer hover:underline">
              Features
            </span>

            <span className="cursor-pointer hover:underline">
              About
            </span>
          </div>

          <button className="rounded-lg border border-[#111111] bg-[#111111] px-4 py-2 text-sm font-medium text-[#ffc515] transition hover:bg-[#292923]">
            GitHub
          </button>

        </div>
      </nav>


      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-24">

        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e9d99d] bg-[#fff3c4] px-4 py-2 text-sm text-[#8d6d00]">

            <span className="h-2 w-2 rounded-full bg-[#ffc515]" />

            Open-source repository intelligence

          </div>


          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">

            Know the health of

            <span className="text-[#b28700]">
              {" "}any repo.
            </span>

          </h1>


          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#6b685f]">

            RepoSheriff analyzes GitHub repositories, scores their health,
            finds problems, and tells contributors exactly what to improve.

          </p>


          {/* Scanner */}
          <div className="mx-auto mt-10 max-w-2xl">

            <div className="flex flex-col gap-3 rounded-2xl border border-[#e9e2cf] bg-white p-3 shadow-xl md:flex-row">

              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                className="min-w-0 flex-1 rounded-xl bg-transparent px-4 py-3 text-[#111111] outline-none placeholder:text-[#aaa69a]"
              />

              <button
                onClick={handleScan}
                className="rounded-xl bg-[#ffc515] px-7 py-3 font-semibold text-[#111111] transition hover:bg-[#edb500]"
              >
                Scan Repository
              </button>

            </div>

            <p className="mt-3 text-xs text-[#8b887e]">
              No GitHub installation required. Paste a public repository URL.
            </p>

          </div>

        </div>

      </section>


      {/* Preview */}
      <section className="mx-auto max-w-6xl px-6 pb-24">

        <div className="overflow-hidden rounded-3xl border border-[#e9e2cf] bg-white shadow-lg">

          {/* Fake dashboard header */}
          <div className="flex items-center justify-between border-b border-[#e9e2cf] px-6 py-5">

            <div>

              <p className="text-sm text-[#8b887e]">
                Repository health
              </p>

              <h2 className="mt-1 text-xl font-semibold text-[#111111]">
                facebook / react
              </h2>

            </div>


            <div className="rounded-full bg-[#fff3c4] px-4 py-2 text-sm font-medium text-[#9a7400]">
              Healthy
            </div>

          </div>


          <div className="grid gap-6 p-6 md:grid-cols-3">

            {/* Score */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6">

              <p className="text-sm text-[#8b887e]">
                Health Score
              </p>


              <div className="mt-4 flex items-end gap-2">

                <span className="text-6xl font-bold text-[#111111]">
                  92
                </span>

                <span className="mb-2 text-[#8b887e]">
                  / 100
                </span>

              </div>


              <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eee9dc]">

                <div className="h-full w-[92%] rounded-full bg-[#ffc515]" />

              </div>


              <p className="mt-3 text-sm text-[#b28700]">
                Excellent repository health
              </p>

            </div>


            {/* Checks */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 md:col-span-2">

              <p className="mb-4 text-sm text-[#8b887e]">
                Repository checks
              </p>


              <div className="grid gap-3 sm:grid-cols-2">

                <Check name="README" status="Passed" />

                <Check name="License" status="Passed" />

                <Check name="Recent activity" status="Passed" />

                <Check name="Description" status="Passed" />

                <Check name="Open issues" status="Warning" />

                <Check name="Community health" status="Passed" />

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* Features */}
      <section className="border-t border-[#e9e2cf] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-20">

          <div className="mb-12 max-w-2xl">

            <p className="text-sm font-medium text-[#b28700]">
              WHAT REPOSHERIFF DOES
            </p>

            <h2 className="mt-3 text-3xl font-bold text-[#111111] md:text-4xl">
              From GitHub repository to actionable report.
            </h2>

          </div>


          <div className="grid gap-5 md:grid-cols-3">

            <Feature
              number="01"
              title="Health Score"
              description="Get a clear score out of 100 based on repository quality and activity."
            />

            <Feature
              number="02"
              title="Find Problems"
              description="Discover missing documentation, stale issues, weak contributor practices, and more."
            />

            <Feature
              number="03"
              title="Improve Faster"
              description="Get plain-English suggestions explaining exactly what maintainers should fix."
            />

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">

        RepoSheriff — GitHub repository health & contributor intelligence

      </footer>

    </main>
  );
}


function Check({
  name,
  status,
}: {
  name: string;
  status: "Passed" | "Warning";
}) {

  const passed = status === "Passed";

  return (

    <div className="flex items-center justify-between rounded-xl border border-[#e9e2cf] bg-white px-4 py-3">

      <span className="text-sm text-[#4f4c45]">
        {name}
      </span>


      <span
        className={`rounded-full px-3 py-1 text-xs font-medium ${
          passed
            ? "bg-[#fff3c4] text-[#9a7400]"
            : "bg-[#fff0c0] text-[#9a7400]"
        }`}
      >
        {status}
      </span>

    </div>

  );
}


function Feature({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {

  return (

    <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6 transition hover:-translate-y-1 hover:shadow-lg">

      <span className="text-sm font-semibold text-[#b28700]">
        {number}
      </span>


      <h3 className="mt-5 text-xl font-semibold text-[#111111]">
        {title}
      </h3>


      <p className="mt-3 leading-7 text-[#6b685f]">
        {description}
      </p>

    </div>

  );
}