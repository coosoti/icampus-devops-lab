import Image from "next/image";
import Link from "next/link";
import type { Project, Tag } from "@/types/project";

interface ProjectCardProps {
  project: Project & { tags?: Tag[]; commentCount?: number };
}

const TAG_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  AWS:           { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
  "CI/CD":       { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  SRE:           { color: "#15803d", bg: "#f0fdf4", border: "#bbf7d0" },
  Kubernetes:    { color: "#1d4ed8", bg: "#eff6ff", border: "#bfdbfe" },
  Terraform:     { color: "#6d28d9", bg: "#f5f3ff", border: "#ddd6fe" },
  Observability: { color: "#c2410c", bg: "#fff7ed", border: "#fed7aa" },
};

export default function ProjectCard({ project }: ProjectCardProps) {
  const tagList = project.tags ?? [];
  const stackList = project.stack ?? [];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-lift"
      style={{
        display: "flex", flexDirection: "column",
        background: "var(--card-bg)", border: "1px solid var(--border)",
        borderRadius: 14, overflow: "hidden",
        textDecoration: "none", color: "inherit",
      }}
    >
      {/* Cover image */}
      <div style={{
        position: "relative", width: "100%", aspectRatio: "16/9",
        background: "var(--card-bg-alt)", overflow: "hidden", flexShrink: 0,
      }}>
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "var(--card-bg-alt)",
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}

        {project.featured && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "var(--accent-green)", color: "white",
            fontFamily: "var(--font-mono)", fontSize: "0.58rem", fontWeight: 500,
            padding: "0.18rem 0.55rem", borderRadius: 999, letterSpacing: "0.08em",
          }}>
            Featured
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "1.1rem 1.15rem 0.9rem", display: "flex", flexDirection: "column", flex: 1, gap: "0.5rem" }}>
        {/* Title */}
        <h3 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "0.98rem", color: "var(--text-primary)", lineHeight: 1.3,
        }}>
          {project.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "var(--font-body)", fontSize: "0.8rem",
          color: "var(--text-secondary)", lineHeight: 1.65, flex: 1,
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {project.description}
        </p>

        {/* Tags + stack */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
          {tagList.map((tag) => {
            const s = TAG_COLORS[tag.name] ?? { color: "#555", bg: "#f5f5f5", border: "#e5e5e5" };
            return (
              <span key={tag.id} style={{
                fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 500,
                color: s.color, background: s.bg, border: `1px solid ${s.border}`,
                borderRadius: 999, padding: "0.12rem 0.5rem",
              }}>
                {tag.name}
              </span>
            );
          })}
          {stackList.slice(0, 3).map((tech) => (
            <span key={tech} style={{
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              color: "var(--text-muted)", background: "var(--card-bg-alt)",
              border: "1px solid var(--border)", borderRadius: 4,
              padding: "0.1rem 0.42rem",
            }}>
              {tech}
            </span>
          ))}
          {stackList.length > 3 && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-muted)" }}>
              +{stackList.length - 3}
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", margin: "0.1rem 0" }} />

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.28rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {project.likeCount ?? 0}
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.28rem", fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {project.commentCount ?? 0}
            </span>
          </div>

          {/* Avatar + verified */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
            <div style={{
              width: 24, height: 24, borderRadius: "50%",
              background: "linear-gradient(135deg, var(--accent-green) 0%, var(--accent-orange) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: "var(--font-mono)", fontSize: "0.58rem",
              color: "white", fontWeight: 700, flexShrink: 0,
            }}>
              {project.title.charAt(0).toUpperCase()}
            </div>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--accent-green)" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}