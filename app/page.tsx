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

  // Attach empty tags/commentCount for ProjectCard compatibility
  const withMeta = (p: typeof allProjects[0]) => ({ ...p, tags: [], commentCount: 0 });

  return (
    <>
      {/* ── Hero ── */}
      <section style={{ background: "var(--bg-primary)", borderBottom: "1px solid var(--border)", overflow: "hidden", position: "relative" }}>
        <div className="dot-grid" style={{ position: "absolute", inset: 0, opacity: 0.35, pointerEvents: "none" }} />

        <div style={{
          maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem",
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "2rem", alignItems: "center", minHeight: 440,
          position: "relative",
        }}>
          {/* Left */}
          <div style={{ padding: "4rem 0" }}>
            <p className="eyebrow" style={{ marginBottom: "1rem" }}>Built by Engineers</p>
            <h1 className="display-heading" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--text-primary)", marginBottom: "0.2rem" }}>
              Explore Production
            </h1>
            <h1 className="display-heading" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", color: "var(--accent-blue)", marginBottom: "1.4rem" }}>
              DevOps Case Studies.
            </h1>
            <p style={{ fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "0.975rem", color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 420, marginBottom: "2rem" }}>
              Real-world cloud infrastructure, CI/CD pipelines, and SRE projects — documented with architecture diagrams, failure scenarios, and recovery paths.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <Link href="/projects" className="btn-cta">Explore projects →</Link>
              <Link href="/admin" className="btn-ghost">Add project</Link>
            </div>
          </div>

          {/* Right — terminal card */}
          <div style={{ position: "relative", display: "flex", justifyContent: "center", alignItems: "center", height: "100%", minHeight: 380 }}>
            <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />

            {[
              { label: "AWS", x: "8%", y: "12%", color: "var(--accent-orange)" },
              { label: "K8s", x: "70%", y: "8%", color: "var(--accent-blue)" },
              { label: "CI/CD", x: "78%", y: "58%", color: "var(--accent-green)" },
              { label: "SRE", x: "4%", y: "68%", color: "var(--accent-blue-bright)" },
              { label: "IaC", x: "40%", y: "82%", color: "var(--accent-orange)" },
            ].map(({ label, x, y, color }) => (
              <div key={label} style={{ position: "absolute", left: x, top: y, border: `1.5px solid ${color}`, borderRadius: 999, padding: "0.3rem 0.75rem", fontFamily: "var(--font-mono)", fontSize: "0.68rem", color, background: `${color}15`, whiteSpace: "nowrap" }}>
                {label}
              </div>
            ))}

            <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.1rem 1.4rem", width: 270, fontFamily: "var(--font-mono)", fontSize: "0.7rem", lineHeight: 1.85, position: "relative", zIndex: 1, boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: "0.7rem" }}>
                {["#ef4444","#f59e0b","#22c55e"].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />)}
              </div>
              <div style={{ color: "var(--text-muted)" }}>$ terraform apply</div>
              <div style={{ color: "var(--accent-green)" }}>✓ Plan: 12 to add</div>
              <div style={{ color: "var(--text-muted)" }}>$ kubectl get pods</div>
              <div style={{ color: "var(--accent-blue-bright)" }}>api-pod  Running</div>
              <div style={{ color: "var(--text-muted)" }}>$ gh workflow run</div>
              <div style={{ color: "var(--accent-orange)" }}>▶ deploy.yml triggered</div>
            </div>

            <div style={{ position: "absolute", bottom: "18%", left: "6%", background: "var(--bg-card)", border: "1px solid var(--accent-green)", borderRadius: 999, padding: "0.28rem 0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--accent-green)", display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent-green)", display: "inline-block" }} />
              99.9% uptime
            </div>
          </div>
        </div>
      </section>

      {/* ── Projects grid ── */}
      <section style={{ maxWidth: 1280, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>
        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: 1, maxWidth: 520 }}>
            <svg style={{ position: "absolute", left: "0.7rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input readOnly placeholder="Search projects..." className="search-input" style={{ paddingLeft: "2.4rem" }} />
          </div>
          <Link href="/projects" className="btn-ghost">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filter by tag
          </Link>
        </div>

        {allProjects.length === 0 ? (
          <div style={{ textAlign: "center", padding: "5rem 0", fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.85rem" }}>
            <div style={{ marginBottom: "0.5rem" }}>No projects yet.</div>
            <Link href="/admin" style={{ color: "var(--accent-blue-bright)", textDecoration: "none" }}>Add your first project →</Link>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <div style={{ marginBottom: "2.5rem" }}>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>Featured</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.1rem" }}>
                  {featured.map((p) => <ProjectCard key={p.id} project={withMeta(p)} />)}
                </div>
              </div>
            )}
            {rest.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "1rem" }}>All projects</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.1rem" }}>
                  {rest.map((p) => <ProjectCard key={p.id} project={withMeta(p)} />)}
                </div>
              </div>
            )}
            {allProjects.length >= 6 && (
              <div style={{ textAlign: "center", marginTop: "3rem" }}>
                <Link href="/projects" className="btn-outline">View all projects</Link>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}