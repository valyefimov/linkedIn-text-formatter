import { defineConfig } from "wxt";

// The shadow root UI swaps `:root` for `:host`, which cannot carry an attribute selector.
// Rewrite the light theme block first so the extension can switch themes on the shadow host.
const hostTheme = {
  postcssPlugin: "host-theme",
  Rule(rule: { selector: string }) {
    rule.selector = rule.selector.replaceAll(':root[data-theme="light"]', ':host([data-theme="light"])');
  },
};

export default defineConfig({
  // WXT pins the `@` alias to `srcDir`, so pointing it at `src` keeps the app's `@/…` imports working.
  srcDir: "src",
  entrypointsDir: "../extension/entrypoints",
  publicDir: "extension/public",
  modules: ["@wxt-dev/module-react"],
  imports: false,
  manifest: {
    name: "LinkedIn Text Formatter",
    description: "Format LinkedIn posts with bold, italic, lists and Markdown right inside the LinkedIn composer.",
    homepage_url: "https://linkedin.yefimov.tech",
  },
  vite: () => ({
    css: { postcss: { plugins: [hostTheme] } },
  }),
});
