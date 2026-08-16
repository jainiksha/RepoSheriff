"use client";

type Tutorial = {
  title: string;
  description: string;
  duration: string;
  category: string;
  videoId: string;
};

const tutorials: Tutorial[] = [
  {
    title: "Git & GitHub Basics",
    description:
      "Learn the fundamentals of Git, GitHub, repositories, commits, branches and the basic workflow.",
    duration: "Beginner",
    category: "Git Basics",
    videoId: "apGV9Kg7ics",
  },
  {
    title: "How to Create a Repository",
    description:
      "Learn how to create a GitHub repository and understand the basic repository structure.",
    duration: "Beginner",
    category: "Repositories",
    videoId: "apGV9Kg7ics",
  },
  {
    title: "Branches & Git Workflow",
    description:
      "Understand branches, why developers use them and how to work safely without changing main directly.",
    duration: "Beginner",
    category: "Branches",
    videoId: "apGV9Kg7ics",
  },
  {
    title: "How to Create a Pull Request",
    description:
      "Learn how to create a branch, push your changes and open a pull request for review.",
    duration: "Beginner",
    category: "Pull Requests",
    videoId: "XwKqvSOEaQY",
  },
  {
    title: "Fork, Clone & Contribute",
    description:
      "Learn the open-source contribution workflow using forks, cloning, branches and pull requests.",
    duration: "Beginner",
    category: "Open Source",
    videoId: "apGV9Kg7ics",
  },
  {
    title: "How to Resolve Merge Conflicts",
    description:
      "Understand why merge conflicts happen and how to resolve them using Git and VS Code.",
    duration: "Intermediate",
    category: "Merge Conflicts",
    videoId: "JtIX3HJKwfo",
  },
];

export default function TutorialsPage() {
  const openVideo = (videoId: string) => {
    window.open(
      `https://www.youtube.com/watch?v=${videoId}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <main className="min-h-screen bg-[#fffdf5] text-[#111111]">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-[#e9e2cf] bg-[#ffc515]">

        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold uppercase tracking-[2px] text-[#735800]">
            RepoSheriff Learning Hub
          </p>

          <h1 className="mt-4 text-5xl font-bold tracking-tight md:text-6xl">
            Learn GitHub.
            <span className="text-[#8d6d00]">
              {" "}Contribute better.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f531f]">
            Learn the Git and GitHub skills you need to work on
            repositories, create branches, submit pull requests,
            and contribute to open-source projects.
          </p>

        </div>

      </section>


      {/* =====================================================
          TUTORIALS
      ====================================================== */}

      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="mb-10">

          <p className="text-sm font-bold uppercase tracking-[2px] text-[#b28700]">
            GitHub Tutorials
          </p>

          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Everything you need to start contributing.
          </h2>

          <p className="mt-3 max-w-2xl leading-7 text-[#6b685f]">
            Select a tutorial below. Each tutorial opens the
            video on YouTube so you can learn step by step.
          </p>

        </div>


        {/* =====================================================
            VIDEO CARDS
        ====================================================== */}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          {tutorials.map((tutorial, index) => (

            <article
              key={tutorial.title}
              className="group overflow-hidden rounded-3xl border border-[#e9e2cf] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >

              {/* Video Preview */}

              <button
                type="button"
                onClick={() =>
                  openVideo(tutorial.videoId)
                }
                className="relative block aspect-video w-full overflow-hidden bg-[#111111] text-left"
              >

                <img
                  src={`https://img.youtube.com/vi/${tutorial.videoId}/hqdefault.jpg`}
                  alt={tutorial.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />

                {/* Dark overlay */}

                <div className="absolute inset-0 bg-black/20 transition group-hover:bg-black/30" />

                {/* Play button */}

                <div className="absolute inset-0 flex items-center justify-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#ffc515] text-2xl font-bold text-[#111111] shadow-lg transition duration-300 group-hover:scale-110">
                    ▶
                  </div>

                </div>

              </button>


              {/* Card Content */}

              <div className="p-6">

                <div className="flex items-center justify-between gap-3">

                  <span className="rounded-full bg-[#fff3c4] px-3 py-1 text-xs font-bold text-[#9a7400]">
                    {tutorial.category}
                  </span>

                  <span className="text-xs font-semibold text-[#77736a]">
                    {tutorial.duration}
                  </span>

                </div>


                <h3 className="mt-5 text-xl font-bold">
                  {tutorial.title}
                </h3>


                <p className="mt-3 leading-7 text-[#6b685f]">
                  {tutorial.description}
                </p>


                <button
                  type="button"
                  onClick={() =>
                    openVideo(tutorial.videoId)
                  }
                  className="mt-6 w-full rounded-xl bg-[#111111] px-5 py-3 font-bold text-[#ffc515] transition hover:bg-[#292922]"
                >
                  Watch on YouTube →
                </button>

              </div>

            </article>

          ))}

        </div>

      </section>


      {/* =====================================================
          WORKFLOW
      ====================================================== */}

      <section className="border-t border-[#e9e2cf] bg-white">

        <div className="mx-auto max-w-6xl px-6 py-16">

          <p className="text-sm font-bold uppercase tracking-[2px] text-[#b28700]">
            Recommended Workflow
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Learn the GitHub contribution flow
          </h2>

          <div className="mt-10 grid gap-4 md:grid-cols-5">

            {[
              "Fork",
              "Clone",
              "Branch",
              "Commit & Push",
              "Pull Request",
            ].map((step, index) => (

              <div
                key={step}
                className="rounded-2xl border border-[#e9e2cf] bg-[#fffdf5] p-5"
              >

                <span className="text-sm font-bold text-[#b28700]">
                  0{index + 1}
                </span>

                <h3 className="mt-3 font-bold">
                  {step}
                </h3>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-[#e9e2cf] bg-[#ffc515] px-6 py-8 text-center text-sm text-[#5f531f]">
        RepoSheriff — Learn, contribute, and improve open-source projects.
      </footer>

    </main>
  );
}