"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title="Toggle Dark/Light Mode"
      style={{
        background: "transparent",
        border: "1px solid #334155",
        borderRadius: "8px",
        padding: "6px 10px",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "16px",
        color: "#ffffff",
      }}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}