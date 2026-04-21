import Link from "next/link";
import type { ProjectWithRelations } from "@/types/project";
import StackBadge from "@/components/ui/StackBadge";

interface HeroProps {
  project: ProjectWithRelations;
}

export default function Hero({ project }: HeroProps) {
  const publishedDate = new Date(project.createdAt);
  const isoDate = publishedDate.toISOString();
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <div style={{ borderBottom: "1px solid var(--border)", paddingBottom: "2.5rem", marginBottom: "2.5rem" }}>

      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"   /* was missing */
        style={{
          fontFamily: "var(--font-mono)", fontSize: "0.7rem",
          color: "var(--text-muted)", marginBottom: "1.25rem",
          display: "flex", alignItems: "center", gap: "0.5rem",
        }}
      >
        <ol style={{ display: "flex", alignItems: "center", gap: "0.5rem", listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <Link href="/projects" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
              Projects
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <span style={{ color: "var(--text-secondary)" }} aria-current="page">
              {project.title}
            </span>
          </li>
        </ol>
      </nav>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1rem" }} aria-label="Project tags">
        {project.tags.map((tag) => (
          <StackBadge key={tag.id} tag={tag} size="md" />
        ))}
      </div>

      {/* Title — this IS the page h1, rendered from the case study page */}
      <h1
        className="display-heading"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "var(--text-primary)", marginBottom: "1rem" }}
      >
        {project.title}
      </h1>

      {/* Description */}
      <p style={{
        fontFamily: "var(--font-body)", fontWeight: 300, fontSize: "1rem",
        color: "var(--text-secondary)", lineHeight: 1.75, maxWidth: 640, marginBottom: "1.5rem",
      }}>
        {project.description}
      </p>

      {/* Stack pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.75rem" }} aria-label="Tech stack">
        {project.stack.map((tech) => (
          <span
            key={tech}
            style={{
              fontFamily: "var(--font-mono)", fontSize: "0.68rem",
              color: "var(--text-muted)",
              background: "var(--card-bg-alt)",   /* was var(--bg-secondary) — didn't exist */
              border: "1px solid var(--border)",
              borderRadius: 5, padding: "0.22rem 0.6rem",
            }}
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <span
          aria-label={`${project.likeCount} likes`}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span aria-hidden="true">{project.likeCount} likes</span>
        </span>

        <span
          aria-label={`${project.commentCount} comments`}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.35rem" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span aria-hidden="true">{project.commentCount} comments</span>
        </span>

        {/* Semantic time element — helps search engines understand publish date */}
        <time
          dateTime={isoDate}
          style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "auto" }}
        >
          {formattedDate}
        </time>
      </div>

      {/* Links */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-cta"
          aria-label={`View ${project.title} source code on GitHub`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          View on GitHub
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
      </div>
    </div>
  );
}