import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Fraunces,
  JetBrains_Mono,
  Plus_Jakarta_Sans,
} from "next/font/google";
import { profileConfig, SITE_URL } from "@/data/profile";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profileConfig.name} — AI, Engineering & Product Portfolio`,
    template: `%s | ${profileConfig.name}`,
  },
  description:
    "Personal portfolio and engineering laboratory of Bhavya Gupta (BITS Pilani '27). Applied AI, ML systems, distributed infrastructure, product analytics, and interactive software.",
  keywords: [
    "Bhavya Gupta",
    "BITS Pilani",
    "AI Engineer",
    "Machine Learning",
    "Product Engineering",
    "Continual Learning",
    "Distributed Systems",
    "Portfolio",
  ],
  authors: [{ name: profileConfig.name, url: SITE_URL }],
  creator: profileConfig.name,
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${profileConfig.name} — Portfolio`,
    title: `${profileConfig.name} — AI, Engineering & Product`,
    description: profileConfig.positioningStatement,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profileConfig.name} — AI, Engineering & Product`,
    description: profileConfig.heroSupporting,
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
    { media: "(prefers-color-scheme: dark)", color: "#141923" },
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
      <body className="min-h-screen antialiased selection:bg-[var(--accent-orange-soft)] selection:text-[var(--ink-primary)]">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[var(--bg-surface)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--ink-primary)] focus:border-2 focus:border-[var(--border-ink)]"
        >
          Skip to main content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
        <script
          type="application/ld+json"
          // Safe static schema serialized with '<' escaped
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </body>
    </html>
  );
}
