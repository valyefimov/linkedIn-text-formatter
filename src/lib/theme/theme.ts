export type Theme = "light" | "dark";

export const THEME_KEY = "ltf:theme";

/**
 * Runs before first paint (inlined in <head>) so the stored or system theme is applied
 * without a flash. Keep it dependency free and in sync with `resolveTheme`.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})()`;

export const resolveTheme = (stored: string | null, systemPrefersLight: boolean): Theme =>
  stored === "light" || stored === "dark" ? stored : systemPrefersLight ? "light" : "dark";

export const otherTheme = (theme: Theme): Theme => (theme === "dark" ? "light" : "dark");
