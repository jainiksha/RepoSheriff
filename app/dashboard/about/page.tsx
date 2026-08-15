export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#fffdf5] px-6 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#b28700]">
            About RepoSheriff
          </p>

          <h1 className="mt-2 text-4xl font-bold text-[#111111]">
            Understand your repository.
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-[#6b685f]">
            RepoSheriff helps developers understand the health and quality
            of a GitHub repository before they start contributing to it.
          </p>
        </div>

        {/* Information Cards */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* What RepoSheriff does */}
          <section className="rounded-2xl border border-[#e9e2cf] bg-white p-6">
            <h2 className="text-xl font-bold text-[#111111]">
              What RepoSheriff does
            </h2>

            <p className="mt-4 leading-7 text-[#6b685f]">
              RepoSheriff analyzes publicly available GitHub repository
              information and presents the results through an easy-to-
              understand health dashboard.
            </p>
          </section>

          {/* Repository health */}
          <section className="rounded-2xl border border-[#e9e2cf] bg-white p-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Repository health
            </h2>

            <p className="mt-4 leading-7 text-[#6b685f]">
              The dashboard highlights important repository signals such as
              documentation, activity, community health, issues, and other
              project information.
            </p>
          </section>

          {/* Health checks */}
          <section className="rounded-2xl border border-[#e9e2cf] bg-white p-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Health checks
            </h2>

            <ul className="mt-4 space-y-3 text-[#6b685f]">
              <li>✓ README and documentation</li>
              <li>✓ License information</li>
              <li>✓ Recent repository activity</li>
              <li>✓ Repository description</li>
              <li>✓ Open issues</li>
              <li>✓ Community health</li>
            </ul>
          </section>

          {/* Built for contributors */}
          <section className="rounded-2xl border border-[#e9e2cf] bg-white p-6">
            <h2 className="text-xl font-bold text-[#111111]">
              Built for contributors
            </h2>

            <p className="mt-4 leading-7 text-[#6b685f]">
              RepoSheriff helps developers quickly understand an unfamiliar
              repository and identify areas that may need attention before
              contributing.
            </p>
          </section>

        </div>

        {/* Our goal */}
        <section className="mt-8 rounded-2xl border border-[#e9e2cf] bg-[#fff3c4] p-6">
          <h2 className="text-xl font-bold text-[#111111]">
            Our goal
          </h2>

          <p className="mt-3 text-[#6b685f]">
            Don&apos;t just clone it. Understand it.
          </p>
        </section>

        {/* Contact Us */}
        <section className="mt-8 rounded-2xl border border-[#e9e2cf] bg-white p-6">
          <h2 className="text-xl font-bold text-[#111111]">
            Contact Us
          </h2>

          <p className="mt-3 leading-7 text-[#6b685f]">
            Have a question, suggestion, or feedback about RepoSheriff?
            We&apos;d love to hear from you.
          </p>

          <p className="mt-3 text-[#6b685f]">
            Email:{" "}
            <span className="font-semibold text-[#b28700]">
              reposheriff@gmail.com
            </span>
          </p>
        </section>

      </div>
    </main>
  );
}