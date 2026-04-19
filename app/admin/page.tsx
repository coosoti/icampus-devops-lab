"use client";

import { useState, useEffect, useRef } from "react";
import type { Tag } from "@/types/project";

interface GalleryItem { url: string; caption: string; uploading?: boolean; }

const EMPTY_FORM = {
  title: "",
  slug: "",
  description: "",
  stack: "",
  overview: "",
  architecture: "",
  ciCd: "",
  observability: "",
  failureScenarios: "",
  githubUrl: "",
  demoUrl: "",
  featured: false,
};

export default function AdminPage() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("#06b6d4");
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then(r => r.json())
      .then(d => setTags(d.tags ?? []))
      .catch(() => {});
  }, []);

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !form.slug) {
      setForm(f => ({
        ...f,
        slug: form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }
  }, [form.title]);

  function update(field: keyof typeof EMPTY_FORM, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function uploadFile(file: File): Promise<string> {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? "Upload failed");
    return data.url as string;
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    try {
      const url = await uploadFile(file);
      setCoverImage(url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCoverUploading(false);
    }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;

    const placeholders = files.map(() => ({ url: "", caption: "", uploading: true }));
    setGallery(prev => [...prev, ...placeholders]);
    const startIndex = gallery.length;

    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadFile(files[i]);
        setGallery(prev => {
          const next = [...prev];
          next[startIndex + i] = { url, caption: "", uploading: false };
          return next;
        });
      } catch {
        setGallery(prev => prev.filter((_, idx) => idx !== startIndex + i));
      }
    }
  }

  function removeGalleryItem(index: number) {
    setGallery(prev => prev.filter((_, i) => i !== index));
  }

  function updateCaption(index: number, caption: string) {
    setGallery(prev =>
      prev.map((item, i) => i === index ? { ...item, caption } : item)
    );
  }

  async function addTag() {
    if (!newTagName.trim()) return;
    try {
      const res = await fetch("/api/admin/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }),
      });
      const data = await res.json();
      if (data.tag) {
        setTags(prev => [...prev, data.tag]);
        setNewTagName("");
      }
    } catch {}
  }

  function toggleTag(id: string) {
    setSelectedTagIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        stack: form.stack.split(",").map(s => s.trim()).filter(Boolean),
        failureScenarios: form.failureScenarios.split("\n").map(s => s.trim()).filter(Boolean),
        coverImage: coverImage ?? undefined,
        tagIds: selectedTagIds,
        galleryUrls: gallery
          .filter(g => g.url && !g.uploading)
          .map(g => ({ url: g.url, caption: g.caption || undefined })),
        featured: form.featured,
        demoUrl: form.demoUrl || undefined,
      };

      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Failed to create project");
        return;
      }

      setSuccess(`Project "${data.project.title}" created successfully!`);
      setForm(EMPTY_FORM);
      setSelectedTagIds([]);
      setCoverImage(null);
      setGallery([]);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "2.5rem 1.5rem 5rem" }}>

      {/* ── Header ── */}
      <div style={{ marginBottom: "2rem" }}>
        <p className="eyebrow" style={{ marginBottom: "0.5rem" }}>Admin</p>
        <h1
          className="display-heading"
          style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "0.4rem" }}
        >
          Add project
        </h1>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-muted)" }}>
          Fill in the form to publish a new case study.
        </p>
      </div>

      {/* ── Alerts ── */}
      {success && (
        <div
          role="alert"
          style={{
            background: "rgba(6,182,212,0.08)",
            border: "1px solid rgba(6,182,212,0.3)",
            borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem",
            fontFamily: "var(--font-body)", fontSize: "0.85rem",
            color: "var(--accent-cyan)",
          }}
        >
          {success}
        </div>
      )}
      {error && (
        <div
          role="alert"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem",
            fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#f87171",
          }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Section 1: Identity ── */}
        <div className="form-section">
          <div className="form-section-title">Project identity</div>
          <div className="form-grid">
            <div className="form-field">
              <label className="label" htmlFor="title">Title *</label>
              <input
                id="title" className="input" required
                value={form.title} onChange={e => update("title", e.target.value)}
                placeholder="CI/CD Multi-Tier Cloud System"
                aria-required="true"
              />
            </div>
            <div className="form-field">
              <label className="label" htmlFor="slug">Slug *</label>
              <input
                id="slug" className="input" required
                value={form.slug} onChange={e => update("slug", e.target.value)}
                placeholder="cicd-cloud-system"
                aria-required="true"
              />
            </div>
            <div className="form-field full">
              <label className="label" htmlFor="description">Description *</label>
              <textarea
                id="description" className="input" required
                value={form.description} onChange={e => update("description", e.target.value)}
                placeholder="Short summary shown on the project card..."
                style={{ minHeight: 72 }}
                aria-required="true"
              />
            </div>
            <div className="form-field">
              <label className="label" htmlFor="githubUrl">GitHub URL *</label>
              <input
                id="githubUrl" className="input" required type="url"
                value={form.githubUrl} onChange={e => update("githubUrl", e.target.value)}
                placeholder="https://github.com/..."
                aria-required="true"
              />
            </div>
            <div className="form-field">
              <label className="label" htmlFor="demoUrl">Demo URL</label>
              <input
                id="demoUrl" className="input" type="url"
                value={form.demoUrl} onChange={e => update("demoUrl", e.target.value)}
                placeholder="https://..."
              />
            </div>
            <div className="form-field full">
              <label className="label" htmlFor="stack">Tech stack *</label>
              <input
                id="stack" className="input" required
                value={form.stack} onChange={e => update("stack", e.target.value)}
                placeholder="AWS, ECS, RDS, Terraform, GitHub Actions"
                aria-required="true"
                aria-describedby="stack-hint"
              />
              <span id="stack-hint" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                Comma-separated
              </span>
            </div>
            <div className="form-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
              <input
                id="featured" type="checkbox"
                checked={form.featured} onChange={e => update("featured", e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--accent-cyan)" }}
              />
              <label htmlFor="featured" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>
                Mark as featured
              </label>
            </div>
          </div>
        </div>

        {/* ── Section 2: Tags ── */}
        <div className="form-section">
          <div className="form-section-title">Tags</div>
          <div
            role="group"
            aria-label="Select tags"
            style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}
          >
            {tags.map(tag => (
              <button
                key={tag.id} type="button"
                onClick={() => toggleTag(tag.id)}
                aria-pressed={selectedTagIds.includes(tag.id)}
                style={{
                  fontFamily: "var(--font-mono)", fontSize: "0.68rem",
                  padding: "0.28rem 0.75rem", borderRadius: 999,
                  border: `1.5px solid ${selectedTagIds.includes(tag.id) ? tag.color : "var(--border-hover)"}`,
                  background: selectedTagIds.includes(tag.id) ? `${tag.color}22` : "transparent",
                  color: selectedTagIds.includes(tag.id) ? tag.color : "var(--text-secondary)",
                  cursor: "pointer",
                }}
              >
                {selectedTagIds.includes(tag.id) ? "✓ " : ""}{tag.name}
              </button>
            ))}
          </div>
          {/* Add new tag */}
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
            <input
              value={newTagName} onChange={e => setNewTagName(e.target.value)}
              placeholder="New tag name"
              aria-label="New tag name"
              className="input" style={{ maxWidth: 180 }}
            />
            <input
              type="color" value={newTagColor}
              onChange={e => setNewTagColor(e.target.value)}
              aria-label="Tag colour"
              style={{ width: 36, height: 36, borderRadius: 6, border: "1px solid var(--border)", background: "none", cursor: "pointer", padding: 2 }}
            />
            <button type="button" onClick={addTag} className="btn-ghost">
              Add tag
            </button>
          </div>
        </div>

        {/* ── Section 3: Cover image ── */}
        <div className="form-section">
          <div className="form-section-title">Cover image</div>
          {coverImage ? (
            <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", marginBottom: "0.75rem" }}>
              <img src={coverImage} alt="Cover preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <button
                type="button" onClick={() => setCoverImage(null)}
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.7)", color: "white", border: "none", borderRadius: 6, padding: "0.25rem 0.6rem", cursor: "pointer", fontSize: "0.75rem" }}
                aria-label="Remove cover image"
              >
                Remove
              </button>
            </div>
          ) : (
            <div
              onClick={() => coverRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Upload cover image"
              onKeyDown={e => e.key === "Enter" && coverRef.current?.click()}
              style={{ border: "2px dashed var(--border-hover)", borderRadius: 10, padding: "2.5rem", textAlign: "center", cursor: "pointer", transition: "border-color 0.2s" }}
            >
              {coverUploading ? (
                <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>Uploading...</p>
              ) : (
                <>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: "0 auto 0.5rem" }} aria-hidden="true">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-muted)" }}>Click to upload cover image</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>JPEG, PNG, WebP · max 5MB</p>
                </>
              )}
            </div>
          )}
          <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} aria-hidden="true" />
        </div>

        {/* ── Section 4: Gallery ── */}
        <div className="form-section">
          <div className="form-section-title">Gallery images</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
            {gallery.map((item, index) => (
              <div key={index} style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--card-bg-alt)" }}>
                <div style={{ aspectRatio: "16/9", position: "relative", background: "var(--card-bg-alt)" }}>
                  {item.uploading ? (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Uploading...</span>
                    </div>
                  ) : (
                    <img src={item.url} alt={item.caption || `Gallery image ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </div>
                <div style={{ padding: "0.4rem" }}>
                  <input
                    value={item.caption}
                    onChange={e => updateCaption(index, e.target.value)}
                    placeholder="Caption (optional)"
                    aria-label={`Caption for gallery image ${index + 1}`}
                    className="input"
                    style={{ fontSize: "0.72rem", padding: "0.3rem 0.5rem" }}
                  />
                </div>
                <button
                  type="button" onClick={() => removeGalleryItem(index)}
                  aria-label={`Remove gallery image ${index + 1}`}
                  style={{ width: "100%", background: "rgba(239,68,68,0.08)", border: "none", borderTop: "1px solid var(--border)", color: "#f87171", fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "0.3rem", cursor: "pointer" }}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Upload button */}
            <div
              onClick={() => galleryRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="Add gallery images"
              onKeyDown={e => e.key === "Enter" && galleryRef.current?.click()}
              style={{ border: "2px dashed var(--border-hover)", borderRadius: 8, aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "0.3rem" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" aria-hidden="true">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Add images</span>
            </div>
          </div>
          <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: "none" }} aria-hidden="true" />
        </div>

        {/* ── Section 5: Case study content ── */}
        <div className="form-section">
          <div className="form-section-title">Case study content</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[
              { key: "overview" as const,      label: "Overview *",         required: true,  placeholder: "Problem statement and what you built..." },
              { key: "architecture" as const,  label: "Architecture *",     required: true,  placeholder: "How services interact, infrastructure layout..." },
              { key: "ciCd" as const,          label: "CI / CD pipeline *", required: true,  placeholder: "Pipeline steps, tools, deployment process..." },
              { key: "observability" as const, label: "Observability *",    required: true,  placeholder: "Logging, metrics, alerting setup..." },
            ].map(({ key, label, required, placeholder }) => (
              <div key={key} className="form-field">
                <label className="label" htmlFor={key}>{label}</label>
                <textarea
                  id={key} className="input"
                  required={required}
                  value={form[key]}
                  onChange={e => update(key, e.target.value)}
                  placeholder={placeholder}
                  style={{ minHeight: 100 }}
                  aria-required={required}
                />
              </div>
            ))}

            <div className="form-field">
              <label className="label" htmlFor="failureScenarios">Failure scenarios</label>
              <textarea
                id="failureScenarios" className="input"
                value={form.failureScenarios}
                onChange={e => update("failureScenarios", e.target.value)}
                placeholder={"DB connection exhaustion: RDS max_connections hit. Resolution: added PgBouncer...\nFailed ECS deployment: bad image pushed to ECR. Resolution: re-tagged last good image..."}
                style={{ minHeight: 120 }}
                aria-describedby="failure-hint"
              />
              <span id="failure-hint" style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                One scenario per line. Format: Title: description. Resolution: fix.
              </span>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            type="submit" className="btn-cta"
            disabled={submitting}
            aria-busy={submitting}
            style={{ opacity: submitting ? 0.7 : 1, padding: "0.7rem 2rem" }}
          >
            {submitting ? "Publishing..." : "Publish project"}
          </button>
          <button
            type="button" className="btn-ghost"
            onClick={() => { setForm(EMPTY_FORM); setCoverImage(null); setGallery([]); setSelectedTagIds([]); }}
          >
            Reset form
          </button>
        </div>

      </form>
    </div>
  );
}