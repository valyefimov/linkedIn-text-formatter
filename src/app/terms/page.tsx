import type { Metadata } from "next";
import { SubPage } from "@/components/SubPage";
import { SITE_NAME } from "@/lib/site/site";

const TITLE = "Terms of use";
const DESCRIPTION = `Plain-language terms for using ${SITE_NAME}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms", title: `${TITLE} | ${SITE_NAME}`, description: DESCRIPTION },
};

export default function TermsPage() {
  return (
    <SubPage path="/terms" title={TITLE} description={DESCRIPTION}>
      <p>By using {SITE_NAME} you agree to these terms.</p>

      <h2>Is the tool free?</h2>
      <p>Yes. There is no charge, no account and no paid plan.</p>

      <h2>What can I do with the output?</h2>
      <p>
        The text you create is yours. Use it on LinkedIn or anywhere else. You are responsible for what you publish and
        for following the rules of the platform you publish it on.
      </p>

      <h2>Are there any guarantees?</h2>
      <p>
        No. The tool is provided as is, without warranty. Unicode-styled text can look different on some devices and is
        not read well by some assistive technology. Character limits are approximate and LinkedIn may change them without
        notice.
      </p>

      <h2>Is this affiliated with LinkedIn?</h2>
      <p>
        No. LinkedIn is a trademark of its owner. This project is independent and is not endorsed by LinkedIn.
      </p>

      <h2>Can these terms change?</h2>
      <p>Yes. The date at the top of this page shows when they were last updated.</p>
    </SubPage>
  );
}
