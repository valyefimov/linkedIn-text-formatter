import type { MetadataRoute } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site/site";

const BACKGROUND = "#131316";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: SITE_NAME,
    short_name: "LI Formatter",
    description: SITE_DESCRIPTION,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: BACKGROUND,
    theme_color: BACKGROUND,
    categories: ["productivity", "business", "utilities"],
    lang: "en",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    screenshots: [
      {
        src: "/screenshots/wide.png",
        sizes: "1440x1000",
        type: "image/png",
        form_factor: "wide",
        label: "Editor with feed preview and character counter",
      },
    ],
    shortcuts: [{ name: "New post", short_name: "New post", url: "/", icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }] }],
  };
}
