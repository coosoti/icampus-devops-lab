import type { Metadata } from "next";
import Link from "next/link";
import { getAllProjects, getAllTags } from "@/lib/queries/projects";
import ProjectCard from "@/components/ui/ProjectCard";

export const metadata: Metadata = {
  title: "iCampus DevOps Lab",
  description: "Production-style DevOps and SRE case studies.",
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
      {/* ── Hero — light grey ── */}
      <section style={{
        background: "var(--hero-bg)",
        borderBottom: "1px solid var(--border-grey)",
        overflow: "hidden",
        position: "relative",
      }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.5, pointerEvents: "none" }} />

        <div className="hero-grid" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem", position: "relative" }}>
          {/* Left — text */}
          <div style={{ padding: "4rem 0 3.5rem" }}>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>Built by Engineers</p>
            <h1 className="display-heading" style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
              color: "var(--text-primary)", marginBottom: "0.1rem",
            }}>
              Explore Production
            </h1>
            <h1 className="display-heading" style={{
              fontSize: "clamp(2.6rem, 5.5vw, 4.2rem)",
              color: "var(--accent-green)", marginBottom: "1.25rem",
            }}>
              DevOps Case Studies.
            </h1>
            <p style={{
              fontFamily: "var(--font-body)", fontWeight: 300,
              fontSize: "clamp(0.875rem, 1.8vw, 0.975rem)",
              color: "var(--text-secondary)", lineHeight: 1.75,
              maxWidth: 400, marginBottom: "2rem",
            }}>
              Real-world cloud infrastructure, CI/CD pipelines, and SRE projects — documented with architecture diagrams, failure scenarios, and recovery paths.
            </p>
            <div className="hero-ctas" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/projects" className="btn-cta">Explore projects →</Link>
              <Link href="/admin" className="btn-ghost">Add project</Link>
            </div>
          </div>

          {/* Right — terminal + floating metrics */}
          <div className="hero-graphic">
            <div style={{
              position: "absolute", width: 280, height: 280, borderRadius: "50%",
              background: "radial-gradient(circle, #16a34a14 0%, transparent 70%)",
              top: "50%", left: "50%", transform: "translate(-50%,-50%)", pointerEvents: "none",
            }} />

            {/* Tech bubbles */}
            {[
              { label: "AWS",  x: "6%",  y: "10%", color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
              { label: "K8s",  x: "68%", y: "6%",  color: "#15803d", bg: "#f0fdf4", border: "#86efac" },
              { label: "SRE",  x: "4%",  y: "65%", color: "#15803d", bg: "#dcfce7", border: "#86efac" },
              { label: "IaC",  x: "72%", y: "75%", color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
            ].map(({ label, x, y, color, bg, border }) => (
              <div key={label} style={{
                position: "absolute", left: x, top: y,
                border: `1.5px solid ${border}`, borderRadius: 999,
                padding: "0.28rem 0.8rem",
                fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 500,
                color, background: bg, whiteSpace: "nowrap",
              }}>
                {label}
              </div>
            ))}

            {/* Terminal card */}
            <div style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-grey)",
              borderRadius: 12, padding: "1rem 1.3rem", width: 255,
              fontFamily: "var(--font-mono)", fontSize: "0.68rem", lineHeight: 1.9,
              position: "relative", zIndex: 1,
              boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
            }}>
              <div style={{ display: "flex", gap: 6, marginBottom: "0.65rem" }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c => (
                  <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{ color: "var(--text-muted)" }}>$ terraform apply</div>
              <div style={{ color: "var(--accent-green)" }}>✓ Plan: 12 to add</div>
              <div style={{ color: "var(--text-muted)" }}>$ kubectl get pods</div>
              <div style={{ color: "var(--accent-blue)" }}>api-pod  Running</div>
              <div style={{ color: "var(--text-muted)" }}>$ gh workflow run</div>
              <div style={{ color: "var(--accent-orange)" }}>▶ deploy.yml triggered</div>
            </div>

            {/* Floating metric cards */}
            {[
              { label: "99.9% uptime",      color: "#15803d", bg: "#f0fdf4", border: "#86efac", pos: { bottom: "20%", left: "2%" } },
              { label: "12 deploys today",  color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", pos: { top: "14%", right: "4%" } },
              { label: "3 alerts resolved", color: "#c2410c", bg: "#fff7ed", border: "#fed7aa", pos: { top: "52%", right: "2%" } },
            ].map(({ label, color, bg, border, pos }) => (
              <div key={label} style={{
                position: "absolute", ...pos,
                background: bg, border: `1px solid ${border}`,
                borderRadius: 8, padding: "0.35rem 0.8rem",
                fontFamily: "var(--font-mono)", fontSize: "0.62rem", fontWeight: 500,
                color, whiteSpace: "nowrap",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              }}>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Toolbar — white bar separating hero from green grid ── */}
      <div className="toolbar">
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <select style={{
              appearance: "none", background: "var(--card-bg-alt)",
              border: "1.5px solid var(--border)", borderRadius: 8,
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

          <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
            <svg style={{ position: "absolute", left: "0.65rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input readOnly placeholder="Search projects..." className="search-input" style={{ paddingLeft: "2.3rem" }} />
          </div>

          <Link href="/projects" className="btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter
          </Link>
        </div>
      </div>

      {/* ── Projects grid — light green background ── */}
      <section style={{ background: "var(--content-bg)", maxWidth: "100%" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
          {allProjects.length === 0 ? (
            <div style={{ textAlign: "center", padding: "5rem 0" }}>
              <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "0.5rem" }}>
                No projects yet.
              </p>
              <Link href="/admin" style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--accent-green)", textDecoration: "none" }}>
                Add your first project →
              </Link>
            </div>
          ) : (
            <>
              {featured.length > 0 && (
                <div style={{ marginBottom: "2.5rem" }}>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
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
                    <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>
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