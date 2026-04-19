import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug, getAllProjects } from "@/lib/queries/projects";
import Hero from "@/components/case-study/Hero";
import Gallery from "@/components/case-study/Gallery";
import SystemBreakdown from "@/components/case-study/SystemBreakdown";
import FailureScenarios from "@/components/case-study/FailureScenarios";
import LikeButton from "@/components/case-study/LikeButton";
import Comments from "@/components/case-study/Comments";

export const dynamic = "force-dynamic";

const SITE_URL = "https://YOUR_DOMAIN_HERE.com"; // ← replace with your production URL

interface PageProps {
  params: Promise<{ slug: string }>;
}

/* ── Static params (optional but great for SEO — enables SSG) ── */
export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

/* ── Per-page metadata ── */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const url = `${SITE_URL}/projects/${slug}`;
  const ogImage = project.coverImage
    ? [{ url: project.coverImage, width: 1200, height: 630, alt: project.title }]
    : [{ url: "/og-image.png", width: 1200, height: 630, alt: project.title }];

  return {
    title: project.title,
    description: project.description,
    keywords: [
      ...project.stack,
      "DevOps",
      "SRE",
      "case study",
      "cloud infrastructure",
      "CI/CD",
    ],
    alternates: { canonical: `/projects/${slug}` },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    openGraph: {
      title: project.title,
      description: project.description,
      url,
      type: "article",
      images: ogImage,
      siteName: "iCampus DevOps Lab",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description,
      images: ogImage.map((i) => i.url),
    },
  };
}

/* ── Page ── */
export default async function CaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const url = `${SITE_URL}/projects/${slug}`;

  /* JSON-LD — TechArticle schema for case studies */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: project.title,
    description: project.description,
    url,
    image: project.coverImage ?? `${SITE_URL}/og-image.png`,
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    author: {
      "@type": "Organization",
      name: "iCampus DevOps Lab",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "iCampus DevOps Lab",
      url: SITE_URL,
    },
    keywords: project.stack.join(", "),
    articleSection: "DevOps Case Study",
    inLanguage: "en-US",
    isAccessibleForFree: true,
  };

  return (
    <>
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

        {/* 1. Hero */}
        <Hero project={project} />

        {/* 2. Architecture diagram */}
        {project.coverImage && (
          <section aria-label="Architecture diagram" style={{ marginBottom: "3rem" }}>
            <h2 style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "1.2rem", color: "var(--text-primary)",
              marginBottom: "1rem", letterSpacing: "-0.01em",
            }}>
              Architecture diagram
            </h2>
            <div style={{
              position: "relative", width: "100%", aspectRatio: "16/9",
              borderRadius: 12, overflow: "hidden",
              border: "1px solid var(--border)", background: "var(--card-bg-alt)",
            }}>
              <Image
                src={project.coverImage}
                alt={`${project.title} architecture diagram`}
                fill
                sizes="(max-width: 1024px) 100vw, 900px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          </section>
        )}

        {/* 3. Gallery */}
        <Gallery images={project.gallery} projectTitle={project.title} />

        {/* 4. System breakdown */}
        <SystemBreakdown
          overview={project.overview}
          architecture={project.architecture}
          ciCd={project.ciCd}
          observability={project.observability}
        />

        {/* 5. Failure scenarios */}
        <FailureScenarios scenarios={project.failureScenarios} />

        {/* 6. Like + links */}
        <div style={{
          borderTop: "1px solid var(--border)", paddingTop: "2rem",
          marginBottom: "3rem", display: "flex", flexWrap: "wrap",
          gap: "0.75rem", alignItems: "center",
        }}>
          <LikeButton slug={project.slug} initialCount={project.likeCount} />

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta"
            aria-label={`View ${project.title} on GitHub`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            GitHub
          </a>

          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
              aria-label={`View live demo of ${project.title}`}
            >
              Live demo →
            </a>
          )}

          <Link
            href="/projects"
            style={{
              marginLeft: "auto", fontFamily: "var(--font-mono)",
              fontSize: "0.72rem", color: "var(--text-muted)", textDecoration: "none",
            }}
          >
            ← All projects
          </Link>
        </div>

        {/* 7. Comments */}
        <Comments slug={project.slug} />

      </div>
    </>
  );
}