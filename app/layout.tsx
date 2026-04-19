import type { Metadata } from "next";
import Link from "next/link";
import MobileNav from "@/components/ui/MobileNav";
import "./globals.css";

const SITE_URL = "https://YOUR_DOMAIN_HERE.com"; // ← replace with your production URL
const SITE_NAME = "iCampus DevOps Lab";
const SITE_DESCRIPTION =
  "Production-style DevOps and SRE case studies — CI/CD pipelines, cloud infrastructure, observability, and reliability engineering by real engineers.";

export const metadata: Metadata = {
  /* ── Core ── */
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "DevOps",
    "SRE",
    "CI/CD",
    "Kubernetes",
    "Terraform",
    "AWS",
    "cloud infrastructure",
    "observability",
    "reliability engineering",
    "DevOps portfolio",
    "SRE case studies",
  ],

  /* ── Canonical & robots ── */
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  /* ── Open Graph ── */
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.png", // create a 1200×630 PNG and place in /public
        width: 1200,
        height: 630,
        alt: "iCampus DevOps Lab — Production DevOps & SRE Case Studies",
      },
    ],
    locale: "en_US",
  },

  /* ── Twitter / X ── */
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
    // creator: "@yourhandle", // ← uncomment and add your Twitter handle
  },

  /* ── Icons ── */
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    // apple: "/apple-touch-icon.png", // ← add a 180×180 PNG to /public
  },

  /* ── Verification (add when you connect Search Console) ── */
  // verification: {
  //   google: "YOUR_GOOGLE_VERIFICATION_CODE",
  // },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/projects?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* ── Nav ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          borderBottom: "1px solid var(--border-grey)",
          background: "rgba(242,242,240,0.95)",
          backdropFilter: "blur(12px)",
        }}>
          <nav style={{
            maxWidth: 1280, margin: "0 auto",
            padding: "0 1.5rem", height: 64,
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                <rect width="26" height="26" rx="7" fill="#06b6d4" opacity="0.12"/>
                <path d="M5 13L10 8L15 13L10 18L5 13Z" fill="#06b6d4"/>
                <path d="M13 13L18 8L23 13L18 18L13 13Z" fill="#0891b2" opacity="0.85"/>
              </svg>
              <span style={{
                fontFamily: "var(--font-display)", fontWeight: 800,
                fontSize: "0.95rem", color: "var(--text-primary)", letterSpacing: "-0.02em",
              }}>
                iCampus<span style={{ color: "var(--accent-cyan)" }}>DevOps</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="nav-links desktop-nav">
              <Link href="/projects" style={{
                fontFamily: "var(--font-body)", fontSize: "0.85rem",
                color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500,
              }}>
                Projects
              </Link>
              <Link href="/admin" style={{
                fontFamily: "var(--font-body)", fontSize: "0.85rem",
                color: "var(--text-secondary)", textDecoration: "none", fontWeight: 500,
              }}>
                Admin
              </Link>
              <a
                href="https://github.com/coosoti/icampus-devops-lab"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-github"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                <span>GitHub ↗</span>
              </a>
            </div>

            <MobileNav />
          </nav>
        </header>

        <main style={{ minHeight: "calc(100vh - 58px)" }}>{children}</main>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: "1px solid var(--border)",
          background: "var(--card-bg-alt)",
          padding: "1.25rem 1.5rem",
        }}>
          <div style={{
            maxWidth: 1280, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "1rem",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)" }}>
              © {new Date().getFullYear()} iCampus DevOps Lab · All Rights Reserved
            </span>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {[
                { label: "Projects", href: "/projects" },
                { label: "Admin", href: "/admin" },
                { label: "GitHub", href: "https://github.com/coosoti/icampus-devops-lab" },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.7rem",
                  color: "var(--text-muted)", textDecoration: "none",
                }}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}