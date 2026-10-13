import {
  AUTHOR,
  FAQ,
  PUBLISHED,
  REPO_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  UPDATED,
  absoluteUrl,
} from "./site";

const author = {
  "@type": "Person",
  "@id": `${AUTHOR.url}/#person`,
  name: AUTHOR.name,
  url: AUTHOR.url,
  description: AUTHOR.bio,
  sameAs: [AUTHOR.github, AUTHOR.url],
};

const website = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
  publisher: { "@id": `${AUTHOR.url}/#person` },
};

const application = {
  "@type": "WebApplication",
  "@id": `${SITE_URL}/#app`,
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  datePublished: PUBLISHED,
  dateModified: UPDATED,
  image: absoluteUrl("/opengraph-image.png"),
  author: { "@id": `${AUTHOR.url}/#person` },
  publisher: { "@id": `${AUTHOR.url}/#person` },
  isPartOf: { "@id": `${SITE_URL}/#website` },
  sameAs: [REPO_URL],
};

const faq = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/#faq`,
  mainEntity: FAQ.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

/** One JSON-LD graph describing the site, the app, the author and the FAQ. */
export const homeJsonLd = { "@context": "https://schema.org", "@graph": [website, application, author, faq] };

export const pageJsonLd = (path: string, name: string, description: string) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${absoluteUrl(path)}#page`,
      url: absoluteUrl(path),
      name,
      description,
      inLanguage: "en",
      dateModified: UPDATED,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      author: { "@id": `${AUTHOR.url}/#person` },
    },
    author,
  ],
});
