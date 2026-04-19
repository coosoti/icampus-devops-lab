"use client";

/**
 * /app/projects/page.tsx
 *
 * Next.js does not support exported `metadata` from "use client" pages.
 * SEO for this route is handled two ways:
 *   1. A sibling layout.tsx at app/projects/layout.tsx exports the metadata (see below).
 *   2. The page itself adds semantic HTML and aria labels for accessibility / crawlability.
 *
 * Create app/projects/layout.tsx with:
 * ─────────────────────────────────────
 * import type { Metadata } from "next";
 * export const metadata: Metadata = {
 *   title: "DevOps Case Studies",
 *   description: "Browse production-style DevOps and SRE projects — CI/CD pipelines, Kubernetes, Terraform, AWS infrastructure, observability stacks, and reliability engineering.",
 *   alternates: { canonical: "/projects" },
 *   openGraph: {
 *     title: "DevOps Case Studies — iCampus DevOps Lab",
 *     description: "Browse production-style DevOps and SRE projects — CI/CD pipelines, Kubernetes, Terraform, AWS, observability and reliability engineering.",
 *     url: "/projects",
 *     images: [{ url: "/og-image.png", width: 1200, height: 630 }],
 *   },
 *   twitter: {
 *     card: "summary_large_image",
 *     title: "DevOps Case Studies — iCampus DevOps Lab",
 *     description: "Browse production-style DevOps and SRE projects.",
 *     images: ["/og-image.png"],
 *   },
 * };
 * export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
 *   return <>{children}</>;
 * }
 * ─────────────────────────────────────
 */

import { useEffect, useState } from "react";
import type { Project, Tag } from "@/types/project";
import ProjectCard from "@/components/ui/ProjectCard";
import FilterBar from "@/components/ui/FilterBar";

export default function ProjectsPage() {
  const [projects, setProjects] = useState<(Project & { tags: Tag[]; commentCount: number })[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/tags")
      .then(r => r.json())
      .then(d => setTags(d.tags ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeTag
      ? `/api/projects?tag=${encodeURIComponent(activeTag)}`
      : "/api/projects";
    fetch(url)
      .then(r => r.json())
      .then(d => setProjects(d.projects ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeTag]);

  const filtered = search.trim()
    ? projects.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.stack.some((s: string) => s.toLowerCase().includes(search.toLowerCase()))
      )
    : projects;

  return (
    <div style={{ background: "var(--content-bg)", minHeight: "100vh" }}>

      {/* ── Page header ── */}
      <header style={{
        background: "var(--hero-bg)",
        borderBottom: "1px solid #0f2744",
        padding: "2.5rem 1.5rem 0",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>All projects</p>

          <h1
            className="display-heading"
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
              color: "#ffffff",
              marginBottom: "0.6rem",
            }}
          >
            DevOps Case Studies
          </h1>

          <p style={{
            fontFamily: "var(--font-body)",
            fontWeight: 300,
            fontSize: "0.92rem",
            color: "#94a3b8",
            maxWidth: 500,
            lineHeight: 1.7,
            marginBottom: "1.75rem",
          }}>
            Production-style infrastructure projects — documented with architecture,
            CI/CD, observability, and failure scenarios.
          </p>

          {/* Toolbar */}
          <div
            role="search"
            aria-label="Filter and search projects"
            style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              flexWrap: "wrap", paddingBottom: "1rem",
            }}
          >
            {/* Sort */}
            <div style={{ position: "relative" }}>
              <select
                aria-label="Sort projects"
                style={{
                  appearance: "none",
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid #1e3a5f",
                  borderRadius: 8,
                  color: "#e2e8f0",
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  padding: "0.48rem 2.2rem 0.48rem 0.85rem",
                  cursor: "pointer",
                }}
              >
                <option>Trending</option>
                <option>Newest</option>
                <option>Most liked</option>
              </select>
              <svg style={{
                position: "absolute", right: "0.6rem", top: "50%",
                transform: "translateY(-50%)", pointerEvents: "none", color: "#64748b",
              }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>

            {/* Search */}
            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <svg style={{
                position: "absolute", left: "0.65rem", top: "50%",
                transform: "translateY(-50%)", color: "#64748b", pointerEvents: "none",
              }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                aria-label="Search projects"
                className="search-input"
                style={{
                  paddingLeft: "2.3rem",
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid #1e3a5f",
                  color: "#e2e8f0",
                }}
              />
            </div>

            {/* Filter toggle */}
            <button
              type="button"
              onClick={() => setShowFilters(v => !v)}
              aria-expanded={showFilters}
              aria-controls="filter-tags"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: showFilters ? "rgba(6,182,212,0.12)" : "rgba(255,255,255,0.06)",
                border: `1.5px solid ${showFilters ? "var(--accent-cyan)" : "#1e3a5f"}`,
                borderRadius: 8, padding: "0.5rem 1rem",
                fontFamily: "var(--font-body)", fontSize: "0.85rem",
                color: showFilters ? "var(--accent-cyan)" : "#94a3b8",
                cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter {activeTag ? `· ${activeTag}` : ""}
            </button>
          </div>

          {/* Filter tags */}
          {showFilters && tags.length > 0 && (
            <div
              id="filter-tags"
              style={{ padding: "0.85rem 0 1rem", borderTop: "1px solid #0f2744" }}
            >
              <FilterBar tags={tags} activeTag={activeTag} onChange={setActiveTag} />
            </div>
          )}
        </div>
      </header>

      {/* ── Grid ── */}
      <main aria-label="Projects list">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>

          {/* Loading skeleton */}
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: "1.1rem" }}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} style={{
                  background: "var(--card-bg)", border: "1px solid var(--border)",
                  borderRadius: 14, overflow: "hidden",
                }}>
                  <div style={{ aspectRatio: "16/9", background: "var(--card-bg-alt)" }} />
                  <div style={{ padding: "1.1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    <div style={{ height: 14, background: "var(--card-bg-alt)", borderRadius: 4, width: "70%" }} />
                    <div style={{ height: 11, background: "var(--card-bg-alt)", borderRadius: 4 }} />
                    <div style={{ height: 11, background: "var(--card-bg-alt)", borderRadius: 4, width: "55%" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results */}
          {!loading && filtered.length > 0 && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: "1.1rem" }}>
                {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
              <p style={{
                fontFamily: "var(--font-mono)", fontSize: "0.68rem",
                color: "var(--text-muted)", textAlign: "right", marginTop: "1.25rem",
              }}>
                {filtered.length} project{filtered.length !== 1 ? "s" : ""}
                {activeTag ? ` · ${activeTag}` : ""}
                {search ? ` · "${search}"` : ""}
              </p>
            </>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <p style={{
                fontFamily: "var(--font-mono)", color: "var(--text-muted)",
                fontSize: "0.85rem", marginBottom: "0.5rem",
              }}>
                No projects found.
              </p>
              {(activeTag || search) && (
                <button
                  type="button"
                  onClick={() => { setActiveTag(null); setSearch(""); }}
                  style={{
                    fontFamily: "var(--font-mono)", fontSize: "0.78rem",
                    color: "var(--accent-cyan)", background: "none",
                    border: "none", cursor: "pointer", textDecoration: "underline",
                  }}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  );
}