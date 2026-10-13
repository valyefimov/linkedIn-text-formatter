import type { Metadata } from "next";
import { SubPage } from "@/components/SubPage";
import { AUTHOR, REPO_URL, SITE_NAME } from "@/lib/site/site";

const TITLE = "About the author and contact";
const DESCRIPTION = `Who built ${SITE_NAME}, why it exists, and how to contact the author.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/about" },
  openGraph: { url: "/about", title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION },
};

export default function AboutPage() {
  return (
    <SubPage path="/about" title={TITLE} description={DESCRIPTION}>
      <p>
        <strong>{AUTHOR.name}</strong> is a software engineer who builds web tools with TypeScript and React. {SITE_NAME} is
        an independent side project, made because LinkedIn has no rich text and the existing formatters had no Markdown
        support, no code styling and no preview.
      </p>

      <h2>Why does this tool exist?</h2>
      <p>
        Posts that mix short bold hooks, lists and code snippets read better, but writing them by hand with Unicode
        characters is slow. The editor does the conversion and shows the post the way the feed will show it. The tool is
        free and has no sign-up.
      </p>

      <h2>How is it made?</h2>
      <ul>
        <li>Next.js and TypeScript, with all text conversion in small tested functions.</li>
        <li>Everything runs in your browser. Nothing you write is sent to a server.</li>
        <li>
          The source code is on <a href={REPO_URL}>GitHub</a>.
        </li>
      </ul>

      <h2>How do I contact the author?</h2>
      <p>For bugs, ideas and questions:</p>
      <ul>
        <li>
          Open an issue on <a href={`${REPO_URL}/issues`}>GitHub</a>.
        </li>
        <li>
          Visit the personal site <a href={AUTHOR.url}>yefimov.tech</a>.
        </li>
        <li>
          Follow the work on <a href={AUTHOR.github}>github.com/valyefimov</a>.
        </li>
      </ul>

      <h2>Is it affiliated with LinkedIn?</h2>
      <p>No. LinkedIn is a trademark of its owner, and this project is not endorsed by or connected to LinkedIn.</p>
    </SubPage>
  );
}
