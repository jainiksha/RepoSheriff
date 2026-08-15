"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";
import Scene3D from "@/components/Scene3D";

export default function Home() {
  const router = useRouter();

  const [repoUrl, setRepoUrl] = useState("");

  const handleScan = () => {
  if (!repoUrl.trim()) {
    alert("Please enter a GitHub repository URL.");
    return;
  }

  router.push("/dashboard");
};

  

  return (
    <main className={styles.page}>
      <Scene3D />

      {/* NAVBAR */}
      <nav className={styles.navbar}>

        <a href="#" className={styles.logo}>
          <img
            src="/reposheriff-logo.png"
            alt="RepoSheriff"
          />
          <span>RepoSheriff</span>
        </a>

        <div className={styles.navLinks}>
          <a href="#how-it-works">How it works</a>
          <a href="#checks">What we check</a>
        </div>

        <button
          className={styles.navButton}
          onClick={() => router.push("/sign-in")}
        >
          Login
        </button>

      </nav>


      {/* HERO */}
      <section className={styles.hero}>

        <div className={styles.heroContent}>

          <div className={styles.eyebrow}>
            <span />
            GITHUB REPOSITORY INTELLIGENCE
          </div>

          <h1>
            Your repository
            <br />
            has a <i>story.</i>
          </h1>

          <p className={styles.heroDescription}>
            RepoSheriff investigates your GitHub repository,
            finds what is healthy, what needs attention,
            and what you should fix next.
          </p>

        </div>

      </section>


      {/* STATS */}
      <section className={styles.stats}>

        <div>
          <strong>06+</strong>
          <span>health checks</span>
        </div>

        <div>
          <strong>100</strong>
          <span>point score</span>
        </div>

        <div>
          <strong>01</strong>
          <span>repository URL</span>
        </div>

        <div>
          <strong>0</strong>
          <span>setup required</span>
        </div>

      </section>


      {/* CHECKS */}
      <section
        id="checks"
        className={styles.checks}
      >

        <div className={styles.sectionHeading}>

          <small>01 — THE INVESTIGATION</small>

          <h2>
            What does the
            <br />
            <i>sheriff</i> check?
          </h2>

          <p>
            RepoSheriff looks beyond the source code
            to understand whether a repository is healthy,
            maintained and contributor-friendly.
          </p>

        </div>


        <div className={styles.checkGrid}>

          <Check
            number="01"
            title="Documentation"
            text="README, license, setup instructions and contribution guides."
          />

          <Check
            number="02"
            title="Activity"
            text="Recent commits and maintenance signals."
          />

          <Check
            number="03"
            title="Community"
            text="Stars, contributors, issues and project activity."
          />

          <Check
            number="04"
            title="Code Quality"
            text="Structure, maintainability and potential problems."
          />

          <Check
            number="05"
            title="Security"
            text="Important security warnings and weaknesses."
          />

          <Check
            number="06"
            title="Actionable Findings"
            text="Understand what needs attention and what to do next."
          />

        </div>

      </section>


      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className={styles.how}
      >

        <div className={styles.sectionHeading}>

          <small>02 — HOW IT WORKS</small>

          <h2>
            Three steps.
            <br />
            That&apos;s it.
          </h2>

        </div>


        <div className={styles.steps}>

          <Step
            number="01"
            title="Paste"
            text="Drop in any public GitHub repository URL."
          />

          <Step
            number="02"
            title="Investigate"
            text="RepoSheriff examines the repository."
          />

          <Step
            number="03"
            title="Understand"
            text="Get a health score and clear recommendations."
          />

        </div>

      </section>


      {/* CTA */}
      <section className={styles.finalCta}>

        <img
          src="/reposheriff-logo.png"
          alt="RepoSheriff"
        />

        <small>REPOSITORY INTELLIGENCE</small>

        <h2>
          Don&apos;t just clone it.
          <br />
          <i>Understand it.</i>
        </h2>

        <p>
          Give RepoSheriff a repository
          and let the investigation begin.
        </p>

        <button onClick={() => router.push("/dashboard")}>
          Scan a repository →
        </button>

      </section>


      {/* FOOTER */}
      <footer className={styles.footer}>

        <div className={styles.footerLogo}>
          <img
            src="/reposheriff-logo.png"
            alt=""
          />

          RepoSheriff
        </div>

        <span>
          Repository intelligence for developers.
        </span>

        <a
          href="https://github.com/Payal430/RepoSheriff"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub ↗
        </a>

      </footer>

    </main>
  );
}


/* COMPONENTS */

function Metric({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div className={styles.metric}>

      <div className={styles.metricTop}>
        <span>{name}</span>
        <b>{value}</b>
      </div>

      <div className={styles.progress}>
        <span style={{ width: `${value}%` }} />
      </div>

    </div>
  );
}


function Check({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className={styles.checkCard}>

      <small>{number}</small>

      <h3>{title}</h3>

      <p>{text}</p>

      <span>→</span>

    </article>
  );
}


function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <article className={styles.step}>

      <small>{number}</small>

      <h3>{title}</h3>

      <p>{text}</p>

    </article>
  );
}