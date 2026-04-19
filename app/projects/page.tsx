"use client";

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
    fetch("/api/tags").then(r => r.json()).then(d => setTags(d.tags ?? [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const url = activeTag ? `/api/projects?tag=${encodeURIComponent(activeTag)}` : "/api/projects";
    fetch(url).then(r => r.json()).then(d => setProjects(d.projects ?? [])).catch(() => {}).finally(() => setLoading(false));
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
      {/* Page header — light grey zone matching nav/hero */}
      <div style={{
        background: "var(--hero-bg)",
        borderBottom: "1px solid var(--border-grey)",
        padding: "2.5rem 1.5rem 0",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>All projects</p>
          <h1 className="display-heading" style={{
            fontSize: "clamp(1.8rem, 3vw, 2.6rem)",
            color: "var(--text-primary)", marginBottom: "0.6rem",
          }}>
            DevOps Case Studies
          </h1>
          <p style={{
            fontFamily: "var(--font-body)", fontWeight: 300,
            fontSize: "0.92rem", color: "var(--text-secondary)",
            maxWidth: 500, lineHeight: 1.7, marginBottom: "1.75rem",
          }}>
            Production-style infrastructure projects — documented with architecture, CI/CD, observability, and failure scenarios.
          </p>

          {/* Toolbar — sits at bottom of grey header */}
          <div style={{
            display: "flex", alignItems: "center", gap: "0.75rem",
            flexWrap: "wrap", paddingBottom: "1rem",
          }}>
            <div style={{ position: "relative" }}>
              <select style={{
                appearance: "none", background: "var(--card-bg)",
                border: "1.5px solid var(--border-grey)", borderRadius: 8,
                color: "var(--text-primary)", fontFamily: "var(--font-body)",
                fontSize: "0.85rem", padding: "0.48rem 2.2rem 0.48rem 0.85rem", cursor: "pointer",
              }}>
                <option>Trending</option>
                <option>Newest</option>
                <option>Most liked</option>
              </select>
              <svg style={{ position: "absolute", right: "0.6rem", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--text-muted)" }} width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>

            <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
              <svg style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="search-input"
                style={{ paddingLeft: "2.3rem", background: "var(--card-bg)" }}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters(v => !v)}
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                background: showFilters ? "#dcfce7" : "var(--card-bg)",
                border: `1.5px solid ${showFilters ? "var(--accent-green)" : "var(--border-grey)"}`,
                borderRadius: 8, padding: "0.5rem 1rem",
                fontFamily: "var(--font-body)", fontSize: "0.85rem",
                color: showFilters ? "var(--accent-green)" : "var(--text-secondary)",
                cursor: "pointer",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
              Filter {activeTag ? `· ${activeTag}` : ""}
            </button>
          </div>

          {/* Filter tags */}
          {showFilters && tags.length > 0 && (
            <div style={{
              padding: "0.85rem 0 1rem",
              borderTop: "1px solid var(--border-grey)",
            }}>
              <FilterBar tags={tags} activeTag={activeTag} onChange={setActiveTag} />
            </div>
          )}
        </div>
      </div>

      {/* ── Grid — light green ── */}
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

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(340px, 100%), 1fr))", gap: "1.1rem" }}>
              {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textAlign: "right", marginTop: "1.25rem" }}>
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}{activeTag ? ` · ${activeTag}` : ""}{search ? ` · "${search}"` : ""}
            </p>
          </>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "5rem 0" }}>
            <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
              No projects found.
            </p>
            {(activeTag || search) && (
              <button
                type="button"
                onClick={() => { setActiveTag(null); setSearch(""); }}
                style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--accent-green)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}