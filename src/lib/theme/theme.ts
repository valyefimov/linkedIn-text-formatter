export type Theme = "light" | "dark";

export const THEME_KEY = "ltf:theme";

/**
 * Runs before first paint (inlined in <head>) so the stored theme (light by default) is applied
 * without a flash. Keep it dependency free and in sync with `resolveTheme`.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t="light"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="light"}})()`;

export const resolveTheme = (stored: string | null): Theme =>
  stored === "light" || stored === "dark" ? stored : "light";

export const otherTheme = (theme: Theme): Theme => (theme === "dark" ? "light" : "dark");
