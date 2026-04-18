interface FailureScenariosProps {
    scenarios: string[];
  }
  
  function parseScenario(text: string): { title: string; diagnosis: string; resolution: string | null } {
    const titleMatch = text.match(/^([^:]+):/);
    const title = titleMatch ? titleMatch[1].trim() : "Scenario";
    const body = titleMatch ? text.slice(titleMatch[0].length).trim() : text;
    const resMatch = body.match(/(?:Resolution|Fix|Recovery):\s*/i);
    const diagnosis = resMatch ? body.slice(0, resMatch.index).trim() : body;
    const resolution = resMatch ? body.slice((resMatch.index ?? 0) + resMatch[0].length).trim() : null;
    return { title, diagnosis, resolution };
  }
  
  export default function FailureScenarios({ scenarios }: FailureScenariosProps) {
    if (!scenarios || scenarios.length === 0) return null;
  
    return (
      <section style={{ marginBottom: "3rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", flexShrink: 0 }} />
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Failure scenarios
          </h2>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1rem", paddingLeft: "1.1rem" }}>
          How the system behaves under failure — and how it recovers.
        </p>
  
        {/* Callout */}
        <div style={{ border: "1px solid rgba(239,68,68,0.25)", background: "rgba(239,68,68,0.06)", borderRadius: 8, padding: "0.7rem 1rem", marginBottom: "1.5rem" }}>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "#fca5a5", lineHeight: 1.65 }}>
            Production systems fail. This section documents known failure modes, their blast radius, detection method, and recovery path.
          </p>
        </div>
  
        <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {scenarios.map((scenario, index) => {
            const { title, diagnosis, resolution } = parseScenario(scenario);
            return (
              <div key={index} style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 1rem", borderBottom: "1px solid var(--border)", background: "rgba(255,255,255,0.02)" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 500, fontSize: "0.88rem", color: "var(--text-primary)", flex: 1 }}>
                    {title}
                  </h3>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "#f87171", background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.25)", borderRadius: 999, padding: "0.12rem 0.5rem" }}>
                    failure
                  </span>
                </div>
  
                {/* Body */}
                <div style={{ padding: "0.85rem 1rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65 }}>
                    {diagnosis}
                  </p>
                  {resolution && (
                    <div style={{ display: "flex", gap: "0.6rem", paddingTop: "0.25rem" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent-green)", flexShrink: 0, marginTop: 6 }} />
                      <div>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--accent-green)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Resolution</span>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.84rem", color: "var(--text-secondary)", lineHeight: 1.65, marginTop: 2 }}>
                          {resolution}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }