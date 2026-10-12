import { Editor } from "@/components/Editor";
import { ThemeToggle } from "@/components/ThemeToggle";
import styles from "./page.module.css";

const FEATURES = [
  { title: "Real-time styles", text: "Bold, italic, underline, strikethrough and monospace, applied to a selection or the word under the caret." },
  { title: "Markdown in, LinkedIn out", text: "Paste Markdown and get Unicode text. Code becomes monospace, or bold if you prefer." },
  { title: "Know your limits", text: "Live counters for posts, comments, headlines and About, plus where “…see more” cuts you off." },
] as const;

export default function Page() {
  return (
    <main className={styles.page}>
      <ThemeToggle />
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Free · No sign-up · Runs in your browser</p>
        <h1 className={styles.title}>
          LinkedIn posts,
          <br />
          <span className={styles.gradient}>properly formatted.</span>
        </h1>
        <p className={styles.lead}>
          LinkedIn has no rich text. Write with bold, italic, lists and code, or convert Markdown, and preview the post
          before you publish.
        </p>
      </header>

      <div className={styles.editor}>
        <Editor />
      </div>

      <section className={styles.features} aria-label="Features">
        {FEATURES.map((feature) => (
          <article key={feature.title} className={styles.feature}>
            <h2>{feature.title}</h2>
            <p>{feature.text}</p>
          </article>
        ))}
      </section>

      <footer className={styles.footer}>
        <p>
          Formatting uses Unicode look-alike characters, so it is not searchable and may be read poorly by screen
          readers. Not affiliated with LinkedIn.
        </p>
        <p className={styles.credit}>
          Built by <a href="https://yefimov.tech">Valentyn Yefimov</a> ·{" "}
          <a href="https://github.com/valyefimov">GitHub</a> · <a href="https://yefimov.tech">yefimov.tech</a>
        </p>
      </footer>
    </main>
  );
}
