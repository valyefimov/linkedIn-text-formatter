import Link from "next/link";
import type { ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { HeaderControls } from "@/components/HeaderControls";
import { pageJsonLd } from "@/lib/site/json-ld";
import { UPDATED } from "@/lib/site/site";
import prose from "./Prose.module.css";
import styles from "./SubPage.module.css";

interface SubPageProps {
  path: string;
  title: string;
  description: string;
  children: ReactNode;
}

export const SubPage = ({ path, title, description, children }: SubPageProps) => (
  <main className={styles.page}>
    <JsonLd data={pageJsonLd(path, title, description)} />
    <HeaderControls />
    <Link href="/" className={styles.back}>
      ← LinkedIn Text Formatter
    </Link>
    <article className={prose.prose}>
      <h1>{title}</h1>
      <p className={prose.byline}>
        <span>
          Last updated <time dateTime={UPDATED}>{new Date(`${UPDATED}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}</time>
        </span>
      </p>
      {children}
    </article>
    <SiteFooter />
  </main>
);
