"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { THEME_KEY, type Theme, otherTheme, resolveTheme } from "@/lib/theme/theme";
import { MoonIcon, SunIcon } from "./icons";
import styles from "./ThemeToggle.module.css";

const readTheme = (): Theme => {
  const applied = document.documentElement.dataset.theme;
  return applied === "light" || applied === "dark"
    ? applied
    : resolveTheme(null, window.matchMedia("(prefers-color-scheme: light)").matches);
};

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(readTheme());
    // Enable colour transitions only after the first paint so the initial theme never animates.
    const frame = requestAnimationFrame(() => document.documentElement.classList.add("theme-ready"));
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next = otherTheme(theme ?? readTheme());
    document.documentElement.dataset.theme = next;
    try {
      window.localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage unavailable: the choice only lasts for this visit.
    }
    setTheme(next);
  };

  const label = theme === "light" ? "Switch to dark theme" : "Switch to light theme";

  return (
    <motion.button
      type="button"
      className={styles.toggle}
      aria-label={label}
      title={label}
      onClick={toggle}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme && (
          <motion.span
            key={theme}
            className={styles.icon}
            initial={{ opacity: 0, rotate: -60, scale: 0.6 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 60, scale: 0.6 }}
            transition={{ duration: 0.18, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {theme === "light" ? <SunIcon /> : <MoonIcon />}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};
