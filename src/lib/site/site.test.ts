import { describe, expect, it } from "vitest";
import { homeJsonLd } from "./json-ld";
import { FAQ, SITE_DESCRIPTION, SITE_TITLE, absoluteUrl } from "./site";

describe("site constants", () => {
  it("builds absolute URLs on the production domain", () => {
    expect(absoluteUrl("/")).toBe("https://linkedin.yefimov.tech/");
    expect(absoluteUrl("/about")).toBe("https://linkedin.yefimov.tech/about");
  });

  it("keeps the title and description within search snippet limits", () => {
    expect(SITE_TITLE.length).toBeLessThanOrEqual(70);
    expect(SITE_DESCRIPTION.length).toBeLessThanOrEqual(200);
  });
});

describe("homeJsonLd", () => {
  const graph = homeJsonLd["@graph"];

  it("describes the site, the app, the author and the FAQ", () => {
    expect(graph.map((node) => node["@type"])).toEqual(["WebSite", "WebApplication", "Person", "FAQPage"]);
  });

  it("includes every FAQ question", () => {
    const faq = graph.find((node) => node["@type"] === "FAQPage");
    expect(faq && "mainEntity" in faq ? faq.mainEntity : []).toHaveLength(FAQ.length);
  });

  it("links the author to their profiles", () => {
    const person = graph.find((node) => node["@type"] === "Person");
    expect(person && "sameAs" in person ? person.sameAs : []).toContain("https://github.com/valyefimov");
  });
});
