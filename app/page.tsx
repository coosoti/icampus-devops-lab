import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getAllProjects, getAllTags } from "@/lib/queries/projects";
import ProjectCard from "@/components/ui/ProjectCard";

export const metadata: Metadata = {
  title: "iCampus DevOps Lab — Production DevOps & SRE Case Studies",
  description:
    "Browse real-world DevOps and SRE projects — CI/CD pipelines, Kubernetes, Terraform, AWS infrastructure, observability stacks, and reliability engineering documented end-to-end.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "iCampus DevOps Lab — Production DevOps & SRE Case Studies",
    description:
      "Browse real-world DevOps and SRE projects — CI/CD pipelines, Kubernetes, Terraform, AWS infrastructure, observability stacks, and reliability engineering documented end-to-end.",
    url: "/",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "iCampus DevOps Lab",
    description: "Production-style DevOps and SRE case studies.",
    images: ["/og-image.png"],
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allProjects, tags] = await Promise.all([
    getAllProjects(),
    getAllTags(),
  ]);

  const featured = allProjects.filter((p) => p.featured);
  const rest = allProjects.filter((p) => !p.featured);
  const withMeta = (p: typeof allProjects[0]) => ({ ...p, tags: [], commentCount: 0 });

  return (
    <>
      {/* ── Hero ── */}
      <section
        aria-label="Hero"
        style={{
          background: "var(--hero-bg)",
          borderBottom: "1px solid #0f2744",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Dot grid */}
        <div
          className="dot-grid"
          style={{ position: "absolute", inset: 0, opacity: 0.6, pointerEvents: "none", zIndex: 0 }}
        />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", position: "relative", zIndex: 1 }}>
          <div className="hero-layout">

            {/* ── Left — text column ── */}
            <div className="hero-text">
              <p className="eyebrow" style={{ marginBottom: "1rem" }}>Built by Engineers</p>

              <h1
                className="display-heading"
                style={{
                  fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                  color: "#ffffff",
                  marginBottom: "0.1rem",
                  whiteSpace: "nowrap",
                }}
              >
                Explore Production
              </h1>
              <h1
                className="display-heading"
                style={{
                  fontSize: "clamp(1.5rem, 2.4vw, 2.25rem)",
                  color: "var(--accent-cyan)",
                  marginBottom: "1.4rem",
                  whiteSpace: "nowrap",
                }}
              >
                DevOps Case Studies.
              </h1>

              <p style={{
                fontFamily: "var(--font-body)",
                fontWeight: 300,
                fontSize: "clamp(0.875rem, 1.8vw, 0.975rem)",
                color: "#94a3b8",
                lineHeight: 1.75,
                maxWidth: 420,
                marginBottom: "2.25rem",
              }}>
                Real-world cloud infrastructure, CI/CD pipelines, and SRE projects — documented
                with architecture diagrams, failure scenarios, and recovery paths.
              </p>

              <div className="hero-ctas" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Link href="/projects" className="btn-cta">Explore projects →</Link>
                <Link href="/admin" className="btn-ghost">Add project</Link>
              </div>
            </div>

            {/* ── Right — hero image ── */}
            <div className="hero-image-panel" aria-hidden="true">
              <Image
                src="/hero_image.png"
                alt=""
                fill
                priority
                sizes="(max-width: 768px) 0px, 50vw"
                style={{ objectFit: "contain", objectPosition: "center right" }}
              />
              <div className="hero-image-fade" />
            </div>

          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <div className="toolbar" role="search" aria-label="Filter projects">
        <div style={{
          maxWidth: 1280, margin: "0 auto",
          display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap",
        }}>
          <div style={{ position: "relative" }}>
            <select
              aria-label="Sort projects"
              style={{
                appearance: "none", background: "var(--card-bg-alt)",
                border: "1.5px solid var(--border)", borderRadius: 8,
                color: "var(--text-primary)", fontFamily: "var(--font-body)",
                fontSize: "0.85rem", padding: "0.48rem 2.2rem 0.48rem 0.85rem", cursor: "pointer",
              }}
            >
              <option>Trending</option>
              <option>Newest</option>
              <option>Most liked</option>
            </select>
            <svg style={{
              position: "absolute", right: "0.6rem", top: "50%",
              transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)",
            }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>

          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <svg style={{
              position: "absolute", left: "0.65rem", top: "50%",
              transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none",
            }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
            <input
              readOnly
              placeholder="Search projects..."
              aria-label="Search projects"
              className="search-input"
              style={{ paddingLeft: "2.3rem" }}
            />
          </div>

          <Link href="/projects" className="btn-ghost" style={{
            background: "var(--card-bg)", border: "1.5px solid var(--border-grey)", color: "var(--text-secondary)",
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            Filter
          </Link>
        </div>
      </div>

      {/* ── Projects grid ── */}
      <section aria-label="Projects" style={{ background: "var(--content-bg)", maxWidth: "100%" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
          {allProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                No projects yet.
              </p>
              <Link href="/admin" style={{
                fontFamily: "var(--font-mono)", fontSize: "0.82rem",
                color: "var(--accent-cyan)", textDecoration: "none",
              }}>
                Add your first project →
              </Link>
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div style={{ marginBottom: "2.5rem" }}>
                  <p style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)",
                    textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem",
                  }}>
                    Featured
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: "1.1rem" }}>
                    {featured.map((p) => <ProjectCard key={p.id} project={withMeta(p)} />)}
                  </div>
                </div>
              )}

              {rest.length > 0 && (
                <div>
                  {featured.length > 0 && (
                    <p style={{
                      fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)",
                      textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem",
                    }}>
                      All projects
                    </p>
                  )}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: "1.1rem" }}>
                    {rest.map((p) => <ProjectCard key={p.id} project={withMeta(p)} />)}
                  </div>
                </div>
              )}

              {allProjects.length >= 6 && (
                <div style={{ textAlign: "center", marginTop: "3rem" }}>
                  <Link href="/projects" className="btn-outline">Load more</Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}