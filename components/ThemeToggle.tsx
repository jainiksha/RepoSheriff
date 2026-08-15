"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const isDark = darkMode;
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleTheme = () => {
    const html = document.documentElement;

    if (html.classList.contains("dark")) {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#111111] bg-white text-lg shadow-sm transition-all duration-300 hover:scale-105 hover:shadow-md dark:border-white dark:bg-gray-900"
      aria-label={darkMode ? "Switch to day mode" : "Switch to night mode"}
      title={darkMode ? "Switch to day mode" : "Switch to night mode"}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}