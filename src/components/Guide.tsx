import Link from "next/link";
import { FAQ } from "@/lib/site/site";
import { ChevronDownIcon } from "./icons";
import styles from "./Prose.module.css";

const MARKDOWN_ROWS: readonly (readonly [string, string])[] = [
  ["# Heading", "Bold line"],
  ["**bold** and *italic*", "Bold and italic letters"],
  ["~~strike~~", "Strikethrough text"],
  ["`inline code`", "Monospace letters (or bold)"],
  ["Fenced code block", "Monospace lines (or bold)"],
  ["- item", "• item"],
  ["1. item", "1. item"],
  ["- [ ] task", "☐ task"],
  ["> quote", "▎ quote"],
  ["[text](https://example.com)", "text (https://example.com)"],
];

const LIMIT_ROWS: readonly (readonly [string, string, string])[] = [
  ["Post", "3,000 characters", "The only limit LinkedIn documents"],
  ["Comment", "1,250 characters", "Observed value"],
  ["Headline", "220 characters", "Only about 60 to 70 show in search results"],
  ["About", "2,600 characters", "Roughly the first 300 show before see more"],
  ["Post preview", "≈210 desktop, ≈140 mobile", "Where the see more link appears"],
];

const STYLES: readonly (readonly [string, string])[] = [
  ["Bold and italic", "Select text and press the toolbar button or ⌘B and ⌘I. Both can be combined."],
  ["Underline and strikethrough", "Added with combining marks, so they work on any text."],
  ["Monospace", "A fixed-width Unicode font for code, commands and file names."],
  ["Lists", "Bullets, numbers, checklists and arrows for any selected lines."],
  ["Emoji and symbols", "A picker with popular emoji and bullet glyphs that render everywhere."],
];

export const Guide = () => (
  <article className={`${styles.prose} ${styles.wide}`} aria-labelledby="guide-title">
    <section className={styles.panel}>
      <h2 id="guide-title">How do I format text for a LinkedIn post?</h2>
      <p>
        Write the post in the editor above, style the parts you want to stand out, and copy the result. LinkedIn does not
        offer formatting buttons, so the styled letters are Unicode characters that you paste as plain text.
      </p>
      <ol className={styles.steps}>
        <li>Type or paste your text into the editor.</li>
        <li>Select a word or line and apply bold, italic, underline, monospace or a list.</li>
        <li>Check the feed preview and the character counter.</li>
        <li>Press Copy for LinkedIn and paste into your post.</li>
      </ol>
    </section>
    <section className={styles.panel}>
      <h2>What formatting does the editor support?</h2>
      <p>Everything below works in LinkedIn posts, comments, headlines and messages.</p>
      <dl className={styles.definitions}>
        {STYLES.map(([term, text]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>{text}</dd>
          </div>
        ))}
      </dl>
    </section>
    <section className={styles.panel}>
      <h2>How do I convert Markdown to LinkedIn text?</h2>
      <p>
        Switch to Markdown mode, or paste Markdown into the editor and it converts automatically. The converter maps each
        Markdown element to the closest thing LinkedIn can display.
      </p>
      <div className={styles.tableWrap}>
        <table>
          <caption className="sr-only">Markdown elements and how they appear on LinkedIn</caption>
          <thead>
            <tr>
              <th scope="col">Markdown</th>
              <th scope="col">On LinkedIn</th>
            </tr>
          </thead>
          <tbody>
            {MARKDOWN_ROWS.map(([from, to]) => (
              <tr key={from}>
                <td>
                  <code>{from}</code>
                </td>
                <td>{to}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
    <section className={styles.panel}>
      <h2>What are the LinkedIn character limits?</h2>
      <p>
        Posts allow 3,000 characters. The counter in the editor switches between posts, comments, headlines and the About
        section, and turns red when you go over.
      </p>
      <div className={styles.tableWrap}>
        <table>
          <caption className="sr-only">LinkedIn character limits by field</caption>
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Limit</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {LIMIT_ROWS.map(([field, limit, note]) => (
              <tr key={field}>
                <td>{field}</td>
                <td>{limit}</td>
                <td>{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Only the post limit is documented by LinkedIn. The other numbers are observed values and can change without notice.
      </p>
    </section>
    <section className={`${styles.panel} ${styles.span}`}>
      <h2>Is Unicode formatting bad for accessibility and search?</h2>
      <div className={styles.split}>
        <div>
          <p>
            It has real costs. Styled letters come from the{" "}
            <a href="https://www.unicode.org/charts/PDF/U1D400.pdf" rel="noopener noreferrer" target="_blank">
              Unicode Mathematical Alphanumeric Symbols
            </a>{" "}
            block, so search does not match them as words and many screen readers read them letter by letter.
          </p>
          <p>
            See the{" "}
            <a href="https://www.linkedin.com/help/linkedin" rel="noopener noreferrer" target="_blank">
              LinkedIn Help Center
            </a>{" "}
            for the platform&apos;s own rules.
          </p>
        </div>
        <ul className={styles.tips}>
          <li>Style short phrases such as a hook or a key term, not whole paragraphs.</li>
          <li>Keep keywords you want to be found in plain text.</li>
          <li>Do not put essential information only in styled text.</li>
        </ul>
      </div>
    </section>
    <section className={`${styles.panel} ${styles.span}`}>
      <h2>Frequently asked questions</h2>
      <div className={styles.accordion}>
        {FAQ.map(({ question, answer }, index) => (
          <details key={question} className={styles.item} open={index === 0}>
            <summary>
              <h3>{question}</h3>
              <span className={styles.chevron}>
                <ChevronDownIcon />
              </span>
            </summary>
            <div className={styles.answer}>
              <p>{answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
    <section className={styles.span}>
      <h2>Related pages</h2>
      <ul className={styles.related}>
        <li>
          <Link href="/about">
            About the author
            <span>Who built the editor and how to get in touch.</span>
          </Link>
        </li>
        <li>
          <Link href="/privacy">
            Privacy policy
            <span>Your text never leaves your browser.</span>
          </Link>
        </li>
        <li>
          <Link href="/terms">
            Terms of use
            <span>Plain-language terms for using the tool.</span>
          </Link>
        </li>
      </ul>
    </section>
  </article>
);
