interface SystemBreakdownProps {
  overview: string;
  architecture: string;
  ciCd: string;
  observability: string;
}

const SECTIONS = [
  { key: "overview"      as const, label: "Overview",         accent: "#64748b", description: "Problem statement and what was built" },
  { key: "architecture"  as const, label: "Architecture",     accent: "#3b82f6", description: "How services interact" },
  { key: "ciCd"          as const, label: "CI / CD pipeline", accent: "#a78bfa", description: "Build, test, and deploy automation" },
  { key: "observability" as const, label: "Observability",    accent: "#f97316", description: "Logs, metrics, and alerting" },
] as const;

export default function SystemBreakdown({ overview, architecture, ciCd, observability }: SystemBreakdownProps) {
  const values = { overview, architecture, ciCd, observability };

  return (
    <section style={{ marginBottom: "3rem" }} aria-label="System breakdown">
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem",
        color: "var(--text-primary)", marginBottom: "0.4rem", letterSpacing: "-0.01em",
      }}>
        System breakdown
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.75rem" }}>
        How the system is designed, deployed, and observed in production.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {SECTIONS.map(({ key, label, accent, description }) => {
          const content = values[key];
          if (!content) return null;

          return (
            <div key={key} style={{ borderLeft: `2px solid ${accent}`, paddingLeft: "1.25rem" }}>
              <div style={{ marginBottom: "0.6rem" }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "0.95rem", color: "var(--text-primary)", marginBottom: "0.15rem" }}>
                  {label}
                </h3>
                {/* Description as a visible caption — also useful for crawlers */}
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {description}
                </p>
              </div>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.75, whiteSpace: "pre-line" }}>
                {content}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}