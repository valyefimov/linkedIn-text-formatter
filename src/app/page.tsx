import { Editor } from "@/components/Editor";
import { Guide } from "@/components/Guide";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";
import { homeJsonLd } from "@/lib/site/json-ld";
import { absoluteUrl } from "@/lib/site/site";
import styles from "./page.module.css";

const HOME = absoluteUrl("/");

export default function Page() {
  return (
    <main className={styles.page}>
      {/* Written by hand: the metadata API drops the trailing slash of the root URL. React hoists these into <head>. */}
      <link rel="canonical" href={HOME} />
      <link rel="alternate" hrefLang="en" href={HOME} />
      <link rel="alternate" hrefLang="x-default" href={HOME} />
      <JsonLd data={homeJsonLd} />
      <ThemeToggle />
      <div className={styles.glow} aria-hidden="true" />
      <header className={styles.hero}>
        <p className={styles.eyebrow}>Free · No sign-up · Runs in your browser</p>
        <h1 className={styles.title}>
          LinkedIn text formatter,
          <br />
          <span className={styles.gradient}>properly done.</span>
        </h1>
        <p className={styles.lead}>
          LinkedIn has no rich text. Write posts and comments with bold, italic, lists and code, convert Markdown, and
          check the character limit and the feed preview before you publish.
        </p>
      </header>

      <div className={styles.editor}>
        <Editor />
      </div>

      <div className={styles.guide}>
        <Guide />
      </div>

      <SiteFooter />
    </main>
  );
}
