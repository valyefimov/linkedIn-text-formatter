export const SITE_URL = "https://linkedin.yefimov.tech";
export const SITE_NAME = "LinkedIn Text Formatter";
export const SITE_TITLE = "LinkedIn Text Formatter: Bold, Italic, Lists & Markdown for Posts";
export const SITE_DESCRIPTION =
  "Free LinkedIn text formatter. Write posts and comments with bold, italic, underline and monospace text, lists and emoji, convert Markdown, and check character limits with a live feed preview.";

export const AUTHOR = {
  name: "Valentyn Yefimov",
  url: "https://yefimov.tech",
  github: "https://github.com/valyefimov",
  bio: "Valentyn Yefimov is a software engineer who builds web tools with TypeScript and React. He made this editor because LinkedIn has no rich text.",
} as const;

export const REPO_URL = "https://github.com/valyefimov/linkedIn-text-formatter";

/** Dates shown on the page and in structured data (ISO 8601). */
export const PUBLISHED = "2026-08-24";
export const UPDATED = "2026-10-14";

export const absoluteUrl = (path = "/"): string => new URL(path, SITE_URL).toString();

export interface Faq {
  question: string;
  answer: string;
}

export const FAQ: readonly Faq[] = [
  {
    question: "How do I format text on LinkedIn?",
    answer:
      "LinkedIn has no formatting buttons in the post editor. Write your text here, select a phrase, apply bold, italic or underline, then press Copy for LinkedIn and paste the result into your post.",
  },
  {
    question: "How does LinkedIn bold text work?",
    answer:
      "The editor swaps normal letters for Unicode look-alike characters that already look bold or italic. LinkedIn displays them as ordinary text, so the styling survives copy and paste.",
  },
  {
    question: "Can I convert Markdown to a LinkedIn post?",
    answer:
      "Yes. Switch to Markdown mode or paste Markdown into the editor. Headings and bold text become bold letters, lists get bullets, and code becomes monospace text.",
  },
  {
    question: "How do I write code on LinkedIn?",
    answer:
      "Use the monospace style. Inline code and code blocks are converted to a monospaced Unicode font so snippets stay readable. You can also render code bold instead.",
  },
  {
    question: "What are the LinkedIn character limits?",
    answer:
      "Posts allow 3,000 characters, comments 1,250, headlines 220 and the About section 2,600. A post is cut with a see more link after roughly 210 characters on desktop and 140 on mobile.",
  },
  {
    question: "Is formatted text bad for accessibility or search?",
    answer:
      "Yes, partly. Unicode-styled text is not searchable on LinkedIn and many screen readers read it letter by letter. Use it for short emphasis, not for whole posts.",
  },
] as const;
