import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

const m = manifest();
const publicFile = (src: string) => join(process.cwd(), "public", src);

describe("web app manifest", () => {
  it("has what browsers require to offer installation", () => {
    expect(m.name).toBeTruthy();
    expect(m.start_url).toBe("/");
    expect(m.display).toBe("standalone");
  });

  it("ships 192 and 512 icons plus a maskable one that exist on disk", () => {
    const icons = m.icons ?? [];
    expect(icons.some((i) => i.sizes === "192x192")).toBe(true);
    expect(icons.some((i) => i.sizes === "512x512" && i.purpose === "any")).toBe(true);
    expect(icons.some((i) => i.purpose === "maskable")).toBe(true);
    for (const icon of icons) expect(existsSync(publicFile(icon.src))).toBe(true);
  });

  it("points screenshots at real files", () => {
    for (const shot of m.screenshots ?? []) expect(existsSync(publicFile(shot.src))).toBe(true);
  });
});
