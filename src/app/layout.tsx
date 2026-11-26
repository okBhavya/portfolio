import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Fraunces,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { profileConfig, SITE_URL } from "@/data/profile";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-hand",
  display: "swap",
  preload: false,
});

const sharedDescription =
  "Personal portfolio and engineering laboratory of Bhavya Gupta (BITS Pilani '27). Applied AI, ML systems, distributed infrastructure, product analytics, and interactive software.";

const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('bhavya-desk-theme');if(t==='night'||t==='day'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profileConfig.name} — AI, Engineering & Product Portfolio`,
    template: `%s | ${profileConfig.name}`,
  },
  description: sharedDescription,
  authors: [{ name: profileConfig.name, url: SITE_URL }],
  creator: profileConfig.name,
  alternates: {
    canonical: SITE_URL,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${profileConfig.name} — Portfolio`,
    title: `${profileConfig.name} — AI, Engineering & Product`,
    description: sharedDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: `${profileConfig.name} — AI, Engineering & Product Portfolio`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profileConfig.name} — AI, Engineering & Product`,
    description: sharedDescription,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3eb" },
    { media: "(prefers-color-scheme: dark)", color: "#111722" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profileConfig.name,
    url: SITE_URL,
    email: `mailto:${profileConfig.email}`,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profileConfig.education.institution,
    },
    sameAs: profileConfig.socials
      .filter((s) => s.id !== "email")
      .map((s) => s.href),
    jobTitle: "Computer Science Student, AI & Product Builder",
    description: profileConfig.positioningStatement,
  };

  const jsonLdString = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${jakarta.variable} ${jetbrainsMono.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased selection:bg-[var(--accent-orange-soft)] selection:text-[var(--ink-primary)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:border-2 focus:border-[var(--border-ink)] focus:bg-[var(--bg-surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--ink-primary)]"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        {(process.env.VERCEL === "1" ||
          Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV)) && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        <script
          type="application/ld+json"
          // Safe static schema serialized with '<' escaped
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </body>
    </html>
  );
}
