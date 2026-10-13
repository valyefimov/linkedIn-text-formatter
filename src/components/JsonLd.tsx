/** Renders a JSON-LD block. `<` is escaped so the data can never close the script tag. */
export const JsonLd = ({ data }: { data: object }) => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
);
