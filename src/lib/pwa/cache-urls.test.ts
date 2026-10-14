import { describe, expect, it } from "vitest";
import { collectCacheUrls } from "./cache-urls";

const ORIGIN = "https://linkedin.yefimov.tech";

describe("collectCacheUrls", () => {
  it("keeps same-origin static assets and strips the origin", () => {
    expect(
      collectCacheUrls([`${ORIGIN}/_next/static/chunks/app.js`, `${ORIGIN}/icons/icon-192.png`], ORIGIN),
    ).toEqual(["/_next/static/chunks/app.js", "/icons/icon-192.png"]);
  });

  it("drops other origins, API-like paths and pages", () => {
    expect(
      collectCacheUrls(
        ["https://fonts.example.com/_next/static/a.js", `${ORIGIN}/api/data`, `${ORIGIN}/about`, "not a url"],
        ORIGIN,
      ),
    ).toEqual([]);
  });

  it("removes duplicates and keeps the query string", () => {
    expect(
      collectCacheUrls([`${ORIGIN}/_next/static/a.css?v=1`, `${ORIGIN}/_next/static/a.css?v=1`], ORIGIN),
    ).toEqual(["/_next/static/a.css?v=1"]);
  });
});
