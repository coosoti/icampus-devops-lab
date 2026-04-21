import Image from "next/image";
import Link from "next/link";
import type { Project, Tag } from "@/types/project";
import StackBadge from "./StackBadge";

interface ProjectCardProps {
  project: Project & { tags: Tag[]; commentCount?: number };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article> {/* semantic wrapper — cards are standalone content units */}
      <Link
        href={`/projects/${project.slug}`}
        className="card-lift"
        aria-label={`View case study: ${project.title}`}
        style={{
          display: "flex",
          flexDirection: "column",
          background: "var(--card-bg)",          /* was var(--bg-card) — didn't exist */
          border: "1px solid var(--border)",
          borderRadius: 14,
          overflow: "hidden",
          textDecoration: "none",
          color: "inherit",
          height: "100%",
        }}
      >
        {/* Cover image */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16/9",
            background: "var(--card-bg-alt)",    /* was var(--bg-secondary) — didn't exist */
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={`${project.title} — architecture diagram cover`} /* more descriptive */
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div
              aria-hidden="true"
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--card-bg-alt)",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
          )}

          {project.featured && (
            <div
              aria-label="Featured project"
              style={{
                position: "absolute", top: 10, left: 10,
                background: "var(--accent-orange)",
                color: "white",
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                fontWeight: 500,
                padding: "0.18rem 0.55rem",
                borderRadius: 999,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Featured
            </div>
          )}
        </div>

        {/* Card body */}
        <div
          style={{
            padding: "1.1rem 1.2rem 1rem",
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: "0.55rem",
          }}
        >
          <h2  /* h2 inside article — correct heading level under page h1 */
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "1rem",
              color: "var(--text-primary)",
              lineHeight: 1.3,
            }}
          >
            {project.title}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.82rem",
              color: "var(--text-secondary)",
              lineHeight: 1.65,
              flex: 1,
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {project.description}
          </p>

          {/* Stack tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem" }}>
            {(project.tags ?? []).map((tag) => (
              <StackBadge key={tag.id} tag={tag} />
            ))}
            {project.stack.slice(0, 3).map((tech) => (
              <span
                key={tech}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.58rem",
                  color: "var(--text-muted)",
                  background: "var(--card-bg-alt)",  /* was var(--bg-secondary) */
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  padding: "0.12rem 0.45rem",
                }}
              >
                {tech}
              </span>
            ))}
          </div>

          <div style={{ height: 1, background: "var(--border)", margin: "0.1rem 0" }} aria-hidden="true" />

          {/* Stats row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
              <span
                aria-label={`${project.likeCount} likes`}
                style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-muted)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                <span aria-hidden="true">{project.likeCount}</span>
              </span>

              <span
                aria-label={`${project.commentCount ?? 0} comments`}
                style={{
                  display: "flex", alignItems: "center", gap: "0.3rem",
                  fontFamily: "var(--font-body)", fontSize: "0.75rem", color: "var(--text-muted)",
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
                <span aria-hidden="true">{project.commentCount ?? 0}</span>
              </span>
            </div>

            {/* Avatar — decorative, hidden from screen readers */}
            <div aria-hidden="true" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <div
                style={{
                  width: 24, height: 24, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-orange) 100%)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "var(--font-mono)", fontSize: "0.58rem",
                  color: "white", fontWeight: 700, flexShrink: 0,
                }}
              >
                {project.title.charAt(0).toUpperCase()}
              </div>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--accent-cyan)" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}