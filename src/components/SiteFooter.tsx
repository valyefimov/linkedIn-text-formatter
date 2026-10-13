import Link from "next/link";
import { AUTHOR, REPO_URL, SITE_NAME } from "@/lib/site/site";
import styles from "./SiteFooter.module.css";

export const SiteFooter = () => (
  <footer className={styles.footer}>
    <nav aria-label="Footer" className={styles.nav}>
      <Link href="/">Editor</Link>
      <Link href="/about">About</Link>
      <Link href="/privacy">Privacy</Link>
      <Link href="/terms">Terms</Link>
      <a href={REPO_URL}>Source code</a>
    </nav>
    <p>
      {SITE_NAME} formats text with Unicode look-alike characters, so it is not searchable and may be read poorly by
      screen readers. Not affiliated with LinkedIn.
    </p>
    <p className={styles.credit}>
      Built by <a href={AUTHOR.url}>{AUTHOR.name}</a> · <a href={AUTHOR.github}>GitHub</a> ·{" "}
      <a href={AUTHOR.url}>yefimov.tech</a>
    </p>
  </footer>
);
