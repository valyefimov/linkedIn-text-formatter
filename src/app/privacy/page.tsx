import type { Metadata } from "next";
import { SubPage } from "@/components/SubPage";
import { REPO_URL, SITE_NAME } from "@/lib/site/site";

const TITLE = "Privacy policy";
const DESCRIPTION = `How ${SITE_NAME} handles your data: your text stays in your browser.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy", title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION },
};

export default function PrivacyPage() {
  return (
    <SubPage path="/privacy" title={TITLE} description={DESCRIPTION}>
      <p>
        <strong>Short version:</strong> the text you write is processed in your browser and is never sent to a server.
      </p>

      <h2>What data does the tool collect?</h2>
      <p>None. There are no accounts, no forms, no analytics scripts and no advertising or tracking cookies.</p>

      <h2>What is stored on my device?</h2>
      <p>The tool saves a few items in your browser&apos;s local storage so your work survives a refresh:</p>
      <ul>
        <li>Your draft text and the Markdown source.</li>
        <li>Your settings: theme, preview device, character limit target, code style.</li>
        <li>The name and headline you type into the preview card.</li>
      </ul>
      <p>
        This data stays on your device. Clear it with the Clear button or by clearing site data in your browser settings.
      </p>

      <h2>Does the site use cookies or third parties?</h2>
      <p>
        No cookies are set. Fonts are served from this site. Links to other sites, such as GitHub or LinkedIn, are governed
        by those sites&apos; own policies.
      </p>

      <h2>What does the hosting provider see?</h2>
      <p>
        Like any website, the host receives standard request information such as the IP address and the page requested.
        This is used to serve the site and is outside the control of the tool.
      </p>

      <h2>Where can I check this?</h2>
      <p>
        The code is open to read on <a href={REPO_URL}>GitHub</a>. Questions can be raised as an issue there.
      </p>
    </SubPage>
  );
}
