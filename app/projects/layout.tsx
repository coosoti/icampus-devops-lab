import type { Metadata } from "next";

/**
 * app/projects/layout.tsx
 *
 * Because projects/page.tsx is a "use client" component, it cannot
 * export metadata directly. This layout wraps it and provides all
 * SEO metadata for the /projects route.
 */

export const metadata: Metadata = {
  title: "DevOps Case Studies",
  description:
    "Browse production-style DevOps and SRE projects — CI/CD pipelines, Kubernetes, Terraform, AWS infrastructure, observability stacks, and reliability engineering documented end-to-end.",
  keywords: [
    "DevOps projects",
    "SRE case studies",
    "Kubernetes examples",
    "Terraform projects",
    "AWS infrastructure",
    "CI/CD pipeline",
    "observability",
    "cloud engineering portfolio",
  ],
  alternates: { canonical: "/projects" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    title: "DevOps Case Studies — iCampus DevOps Lab",
    description:
      "Browse production-style DevOps and SRE projects — CI/CD pipelines, Kubernetes, Terraform, AWS, observability and reliability engineering.",
    url: "/projects",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "iCampus DevOps Lab Projects" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevOps Case Studies — iCampus DevOps Lab",
    description: "Browse production-style DevOps and SRE projects.",
    images: ["/og-image.png"],
  },
};

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}