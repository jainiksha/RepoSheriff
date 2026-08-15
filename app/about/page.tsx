export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111] dark:bg-[#111111] dark:text-white">

      {/* Header */}
      <section className="border-b border-[#e9e2cf] bg-[#ffc515]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <h1 className="text-4xl font-bold md:text-5xl">
            About RepoSheriff
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-[#5f531f]">
            Making GitHub repositories easier to understand, analyze,
            improve, and contribute to.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border border-[#e9e2cf] bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-900 md:p-10">

          <p className="text-sm font-semibold text-[#b28700]">
            WHAT IS REPOSHERIFF?
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Understand repositories faster.
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#6b685f] dark:text-gray-300">
            RepoSheriff is an AI-powered Open Source Repository Intelligence
            Platform that helps developers quickly understand and analyze
            complex GitHub repositories.
          </p>

          <p className="mt-4 max-w-3xl leading-7 text-[#6b685f] dark:text-gray-300">
            It helps developers explore repository structure, understand
            project health, identify problems, and discover better ways
            to contribute.
          </p>

        </div>
      </section>

      {/* What We Do */}
      <section className="border-t border-[#e9e2cf] bg-white dark:border-gray-700 dark:bg-[#111111]">
        <div className="mx-auto max-w-6xl px-6 py-16">

          <div className="mb-10">
            <p className="text-sm font-semibold text-[#b28700]">
              WHAT WE DO
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Everything you need to understand a repository.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">

            {/* Analyze */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-7 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="text-3xl">🔍</div>

              <h3 className="mt-5 text-xl font-semibold">
                Analyze
              </h3>

              <p className="mt-3 leading-7 text-[#6b685f] dark:text-gray-300">
                Analyze repository structure, architecture, technologies,
                dependencies, and overall health.
              </p>
            </div>

            {/* Understand */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-7 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="text-3xl">🤖</div>

              <h3 className="mt-5 text-xl font-semibold">
                Understand
              </h3>

              <p className="mt-3 leading-7 text-[#6b685f] dark:text-gray-300">
                Get simple explanations and useful insights about
                unfamiliar GitHub repositories.
              </p>
            </div>

            {/* Improve */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-7 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="text-3xl">🐞</div>

              <h3 className="mt-5 text-xl font-semibold">
                Improve
              </h3>

              <p className="mt-3 leading-7 text-[#6b685f] dark:text-gray-300">
                Identify problems, code quality concerns, and areas
                where a repository can be improved.
              </p>
            </div>

            {/* Contribute */}
            <div className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-7 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900">
              <div className="text-3xl">🚀</div>

              <h3 className="mt-5 text-xl font-semibold">
                Contribute
              </h3>

              <p className="mt-3 leading-7 text-[#6b685f] dark:text-gray-300">
                Help developers find the right starting point and
                contribute more effectively to open-source projects.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Why RepoSheriff */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="mb-10">
          <p className="text-sm font-semibold text-[#b28700]">
            WHY REPOSHERIFF?
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            From hours of exploration to minutes of understanding.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Traditional */}
          <div className="rounded-2xl border border-[#e9e2cf] bg-white p-7 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <h3 className="text-xl font-semibold">
              Traditional Approach
            </h3>

            <div className="mt-6 space-y-4">
              <p>📖 Read the README</p>
              <p>📂 Explore files manually</p>
              <p>🧩 Understand the architecture</p>
              <p>🔍 Search for relevant issues</p>
              <p>⏳ Spend hours onboarding</p>
            </div>
          </div>

          {/* RepoSheriff */}
          <div className="rounded-2xl border-2 border-[#ffc515] bg-[#fffdf5] p-7 shadow-sm dark:bg-gray-900">
            <h3 className="text-xl font-semibold">
              RepoSheriff Approach
            </h3>

            <div className="mt-6 space-y-4">
              <p>🤖 AI-powered repository analysis</p>
              <p>📊 Instant repository insights</p>
              <p>🧩 Architecture understanding</p>
              <p>🎯 Contribution guidance</p>
              <p>⚡ Understand repositories faster</p>
            </div>
          </div>

        </div>
      </section>

      {/* Final Message */}
      <section className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-16 text-center">

        <h2 className="text-3xl font-bold md:text-4xl">
          Minutes, Not Hours.
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-lg text-[#5f531f]">
          RepoSheriff transforms complex repository exploration into
          an AI-guided experience.
        </p>

        <p className="mt-8 text-lg font-bold">
          Analyze • Understand • Improve • Contribute
        </p>

      </section>

    </main>
  );
}