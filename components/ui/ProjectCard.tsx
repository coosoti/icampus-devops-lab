import Image from "next/image";
import Link from "next/link";
import type { Project, Tag } from "@/types/project";
import StackBadge from "./StackBadge";

interface ProjectCardProps {
  project: Project & { tags: Tag[]; commentCount?: number };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="card-lift"
      style={{
        display: "flex",
        flexDirection: "column",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        overflow: "hidden",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      {/* Cover image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16/9",
          background: "var(--bg-secondary)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {project.coverImage ? (
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        ) : (
          /* Placeholder when no cover image */
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-card) 100%)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </div>
        )}

        {project.featured && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
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
        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "1rem",
            color: "var(--text-primary)",
            lineHeight: 1.3,
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
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
          {project.tags.map((tag) => (
            <StackBadge key={tag.id} tag={tag} />
          ))}
          {project.stack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                color: "var(--text-muted)",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: 4,
                padding: "0.12rem 0.45rem",
              }}
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "var(--border)", margin: "0.1rem 0" }} />

        {/* Bottom row — likes / comments / avatar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
            {/* Likes */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {project.likeCount}
            </span>

            {/* Comments */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.3rem",
                fontFamily: "var(--font-body)",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              {project.commentCount ?? 0}
            </span>
          </div>

          {/* Author avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--accent-blue) 0%, var(--accent-orange) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-mono)",
                fontSize: "0.58rem",
                color: "white",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {project.title.charAt(0).toUpperCase()}
            </div>
            {/* Verified star */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--accent-blue)" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}