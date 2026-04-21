"use client";

import { useState, useEffect } from "react";
import type { Comment } from "@/types/comment";

interface CommentsProps {
  slug: string;
}

export default function Comments({ slug }: CommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ authorName: "", authorEmail: "", body: "" });

  useEffect(() => {
    fetch(`/api/projects/${slug}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch(`/api/projects/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to post comment"); return; }
      setComments((prev) => [data.comment, ...prev]);
      setForm({ authorName: "", authorEmail: "", body: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function timeAgo(date: Date | string): { relative: string; iso: string; formatted: string } {
    const d = new Date(date);
    const diff = Date.now() - d.getTime();
    const mins = Math.floor(diff / 60000);
    let relative = "just now";
    if (mins >= 1 && mins < 60) relative = `${mins}m ago`;
    else if (mins >= 60 && mins < 1440) relative = `${Math.floor(mins / 60)}h ago`;
    else if (mins >= 1440) relative = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return {
      relative,
      iso: d.toISOString(),
      formatted: d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
    };
  }

  return (
    <section style={{ marginBottom: "3rem" }} aria-label="Discussion">
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem",
        color: "var(--text-primary)", marginBottom: "1.75rem", letterSpacing: "-0.01em",
      }}>
        Discussion
        {comments.length > 0 && (
          <span style={{ marginLeft: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 400 }}>
            {comments.length} comment{comments.length !== 1 ? "s" : ""}
          </span>
        )}
      </h2>

      {/* Comment form */}
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Leave a comment"
        style={{
          background: "var(--card-bg)",    /* was var(--bg-card) — didn't exist */
          border: "1px solid var(--border)",
          borderRadius: 12, padding: "1.25rem", marginBottom: "1.75rem",
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--accent-cyan)", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}> {/* was --accent-blue-bright */}
          Leave a comment
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label className="label" htmlFor="authorName">Name *</label>
            <input
              id="authorName" className="input" type="text" required
              placeholder="Your name" value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              aria-required="true"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem" }}>
            <label className="label" htmlFor="authorEmail">Email *</label>
            <input
              id="authorEmail" className="input" type="email" required
              placeholder="your@email.com" value={form.authorEmail}
              onChange={(e) => setForm((f) => ({ ...f, authorEmail: e.target.value }))}
              aria-required="true"
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.3rem", marginBottom: "1rem" }}>
          <label className="label" htmlFor="body">Comment *</label>
          <textarea
            id="body" className="input" required
            placeholder="Share your thoughts, questions, or feedback..."
            value={form.body}
            onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
            style={{ minHeight: 100, resize: "vertical" }}
            aria-required="true"
            aria-describedby="body-count"
            maxLength={2000}
          />
          <span id="body-count" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", textAlign: "right" }}>
            {form.body.length} / 2000
          </span>
        </div>

        {error && (
          <div
            role="alert"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "#f87171", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 6, padding: "0.5rem 0.75rem", marginBottom: "0.75rem" }}
          >
            {error}
          </div>
        )}
        {submitted && (
          <div
            role="alert"
            style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--accent-cyan)", background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.25)", borderRadius: 6, padding: "0.5rem 0.75rem", marginBottom: "0.75rem" }} /* was --accent-green */
          >
            Comment posted — it will appear after moderation.
          </div>
        )}

        <button
          type="submit" className="btn-cta"
          disabled={submitting} aria-busy={submitting}
          style={{ opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </form>

      {/* Comment list */}
      {loading ? (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)", padding: "1rem 0" }}>
          Loading comments…
        </p>
      ) : comments.length === 0 ? (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)", padding: "1rem 0", textAlign: "center" }}>
          No comments yet. Be the first to share your thoughts.
        </p>
      ) : (
        <ol style={{ display: "flex", flexDirection: "column", gap: "1rem", listStyle: "none", padding: 0, margin: 0 }} aria-label="Comments">
          {comments.map((comment) => {
            const { relative, iso, formatted } = timeAgo(comment.createdAt);
            return (
              <li key={comment.id}>
                <article
                  style={{
                    background: "var(--card-bg)",    /* was var(--bg-card) */
                    border: "1px solid var(--border)",
                    borderRadius: 10, padding: "1rem 1.1rem",
                  }}
                >
                  <header style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.6rem" }}>
                    {/* Avatar — decorative */}
                    <div
                      aria-hidden="true"
                      style={{
                        width: 28, height: 28, borderRadius: "50%",
                        background: "linear-gradient(135deg, var(--accent-cyan) 0%, var(--accent-blue) 100%)", /* was blue/orange */
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontFamily: "var(--font-mono)", fontSize: "0.62rem",
                        color: "white", fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {comment.authorName.charAt(0).toUpperCase()}
                    </div>

                    <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", fontWeight: 500, color: "var(--text-primary)" }}>
                      {comment.authorName}
                    </span>

                    {/* Semantic time element */}
                    <time
                      dateTime={iso}
                      title={formatted}
                      style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", marginLeft: "auto" }}
                    >
                      {relative}
                    </time>
                  </header>

                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                    {comment.body}
                  </p>
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}