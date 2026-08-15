export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111]">

      {/* ================= HEADER ================= */}
      <section className="border-b border-[#e9e2cf] bg-[#ffc515]">
        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold uppercase tracking-wider text-[#5f531f]">
            REPOSITORY INTELLIGENCE
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            About RepoSheriff
          </h1>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#5f531f]">
            Making GitHub repositories easier to understand, analyze,
            improve, and contribute to.
          </p>

        </div>
      </section>


      {/* ================= WHAT IS REPOSHERIFF ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-sm md:p-10">

          <p className="text-sm font-bold tracking-wider text-[#b28700]">
            WHAT IS REPOSHERIFF?
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Understand complex repositories faster.
          </h2>

          <p className="mt-5 max-w-4xl text-lg leading-8 text-gray-600">
            RepoSheriff is an AI-powered Open Source Repository Intelligence
            Platform designed to help developers quickly understand and
            analyze complex GitHub repositories.
          </p>

          <p className="mt-4 max-w-4xl leading-7 text-gray-600">
            Instead of spending hours manually exploring folders, files,
            documentation, dependencies, and project structure, RepoSheriff
            brings important repository insights together in one place.
          </p>

        </div>

      </section>


      {/* ================= THE PROBLEM ================= */}
      <section className="border-y border-[#e9e2cf] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold tracking-wider text-[#b28700]">
            THE PROBLEM
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Understanding an unfamiliar repository takes time.
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-gray-600">
            When developers enter a new project, they often need to understand
            its structure, architecture, technologies, dependencies, code
            quality, and existing issues before they can confidently make
            changes or contribute.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6">
              <div className="text-3xl">📂</div>

              <h3 className="mt-4 text-xl font-bold">
                Explore
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                Developers manually explore folders, files, documentation,
                and project structure.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6">
              <div className="text-3xl">🧩</div>

              <h3 className="mt-4 text-xl font-bold">
                Understand
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                They need to understand how different parts of the repository
                work together.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-6">
              <div className="text-3xl">⏳</div>

              <h3 className="mt-4 text-xl font-bold">
                Spend Time
              </h3>

              <p className="mt-2 leading-7 text-gray-600">
                This can create a long onboarding process before meaningful
                contribution can begin.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= HOW WE HELP ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <p className="text-sm font-bold tracking-wider text-[#b28700]">
          HOW REPOSHERIFF HELPS
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          From repository exploration to actionable insights.
        </h2>

        <p className="mt-5 max-w-3xl leading-7 text-gray-600">
          RepoSheriff combines repository analysis and intelligent insights
          to give developers a clearer understanding of unfamiliar projects.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">

          {/* Analyze */}
          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc515] text-2xl">
              🔍
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Repository Analysis
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Analyze repository structure, architecture, technologies,
              dependencies, and other important project information.
            </p>

          </div>


          {/* AI Understanding */}
          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc515] text-2xl">
              🤖
            </div>

            <h3 className="mt-5 text-xl font-bold">
              AI-Powered Understanding
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Get useful explanations and insights that make unfamiliar
              repositories easier to understand.
            </p>

          </div>


          {/* Health */}
          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc515] text-2xl">
              📊
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Repository Health
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Evaluate important aspects of repository quality such as
              maintainability, testing, security, and overall health.
            </p>

          </div>


          {/* Issues */}
          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ffc515] text-2xl">
              🐞
            </div>

            <h3 className="mt-5 text-xl font-bold">
              Issue & Improvement Insights
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Identify potential issues, code-quality concerns, and areas
              where the repository can be improved.
            </p>

          </div>

        </div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="border-y border-[#e9e2cf] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold tracking-wider text-[#b28700]">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            From GitHub repository to useful insights.
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-5">

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5 text-center">
              <div className="text-3xl">1️⃣</div>
              <h3 className="mt-3 font-bold">
                Repository
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Select a GitHub repository.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5 text-center">
              <div className="text-3xl">2️⃣</div>
              <h3 className="mt-3 font-bold">
                Analyze
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Analyze repository information.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5 text-center">
              <div className="text-3xl">3️⃣</div>
              <h3 className="mt-3 font-bold">
                Understand
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Understand structure and project health.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5 text-center">
              <div className="text-3xl">4️⃣</div>
              <h3 className="mt-3 font-bold">
                Insights
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Discover issues and improvements.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5 text-center">
              <div className="text-3xl">5️⃣</div>
              <h3 className="mt-3 font-bold">
                Contribute
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Find better ways to contribute.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* ================= WHO IS IT FOR ================= */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <p className="text-sm font-bold tracking-wider text-[#b28700]">
          WHO IS REPOSHERIFF FOR?
        </p>

        <h2 className="mt-3 text-3xl font-bold">
          Built for developers and contributors.
        </h2>

        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm">
            <div className="text-3xl">👨‍💻</div>

            <h3 className="mt-4 text-xl font-bold">
              Developers
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Understand unfamiliar codebases faster and get a clearer
              picture of project structure and health.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm">
            <div className="text-3xl">🌱</div>

            <h3 className="mt-4 text-xl font-bold">
              Beginners
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Reduce the difficulty of entering unfamiliar open-source
              repositories.
            </p>
          </div>

          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm">
            <div className="text-3xl">🤝</div>

            <h3 className="mt-4 text-xl font-bold">
              Contributors
            </h3>

            <p className="mt-3 leading-7 text-gray-600">
              Find useful starting points and understand where meaningful
              contributions can be made.
            </p>
          </div>

        </div>

      </section>


      {/* ================= WHY REPOSHERIFF ================= */}
      <section className="border-y border-[#e9e2cf] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold tracking-wider text-[#b28700]">
            WHY REPOSHERIFF?
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Spend less time exploring. Start contributing sooner.
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">

            {/* Traditional */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-8">

              <h3 className="text-xl font-bold">
                Traditional Approach
              </h3>

              <div className="mt-6 space-y-4 text-gray-600">
                <p>📖 Read documentation</p>
                <p>📂 Explore files manually</p>
                <p>🧩 Understand architecture</p>
                <p>🔍 Search for issues</p>
                <p>⏳ Spend hours onboarding</p>
              </div>

            </div>


            {/* RepoSheriff */}
            <div className="rounded-2xl border-2 border-[#ffc515] bg-[#fffdf5] p-8">

              <h3 className="text-xl font-bold">
                With RepoSheriff
              </h3>

              <div className="mt-6 space-y-4 text-gray-600">
                <p>🤖 AI-powered repository analysis</p>
                <p>📊 Quick repository insights</p>
                <p>🧩 Easier architecture understanding</p>
                <p>🐞 Issue and improvement insights</p>
                <p>🚀 Contribution guidance</p>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}
      <section className="bg-[#ffc515] px-6 py-20 text-center">

        <p className="text-sm font-bold uppercase tracking-wider text-[#5f531f]">
          REPOSHERIFF
        </p>

        <h2 className="mt-3 text-4xl font-bold md:text-5xl">
          Minutes, Not Hours.
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#5f531f]">
          Turn complex repository exploration into a clearer,
          AI-guided experience.
        </p>

        <p className="mt-8 text-lg font-bold">
          Analyze • Understand • Improve • Contribute
        </p>

      </section>

    </main>
  );
}