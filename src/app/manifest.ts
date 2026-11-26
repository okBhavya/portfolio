import type { MetadataRoute } from "next";
import { profileConfig } from "@/data/profile";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${profileConfig.name} — AI, Engineering & Product`,
    short_name: profileConfig.name,
    description: profileConfig.positioningStatement,
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3eb",
    theme_color: "#b54b0d",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
