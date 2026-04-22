"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import type { Tag, Project } from "@/types/project";

interface GalleryItem { url: string; caption: string; uploading?: boolean; }

const EMPTY_FORM = {
  title: "", slug: "", description: "", stack: "",
  overview: "", architecture: "", ciCd: "", observability: "",
  failureScenarios: "", githubUrl: "", demoUrl: "", featured: false,
};

export default function AdminPage() {
  // ── Project list ──────────────────────────────────────────────────────────
  const [projects, setProjects] = useState<Project[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Form ──────────────────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<string | null>(null);
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
  const [newTagColor, setNewTagColor] = useState("#16a34a");
  const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  const coverRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // ── Load data ─────────────────────────────────────────────────────────────
  useEffect(() => {
    Promise.all([
      fetch("/api/projects").then(r => r.json()).then(d => setProjects(d.projects ?? [])),
      fetch("/api/tags").then(r => r.json()).then(d => setTags(d.tags ?? [])),
    ]).finally(() => setListLoading(false));
  }, []);

  // Auto-slug from title (only when creating new)
  useEffect(() => {
    if (!editingId && form.title && !form.slug) {
      setForm(f => ({
        ...f,
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      }));
    }
  }, [form.title, editingId]);

  function update(field: keyof typeof EMPTY_FORM, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }));
  }

  // ── Edit: pre-fill form ───────────────────────────────────────────────────
  async function startEdit(project: Project) {
    setEditingId(project.id!);
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      stack: project.stack.join(", "),
      overview: project.overview,
      architecture: project.architecture,
      ciCd: project.ciCd,
      observability: project.observability,
      failureScenarios: project.failureScenarios.join("\n"),
      githubUrl: project.githubUrl,
      demoUrl: project.demoUrl ?? "",
      featured: project.featured,
    });
    setCoverImage(project.coverImage ?? null);
    setGallery([]);
    setSelectedTagIds([]);
    setSuccess(null);
    setError(null);
    setActiveTab("form");
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setSelectedTagIds([]);
    setCoverImage(null);
    setGallery([]);
    setSuccess(null);
    setError(null);
    setActiveTab("form");
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function confirmDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/projects?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects(prev => prev.filter(p => p.id !== id));
        setDeleteId(null);
      } else {
        alert("Failed to delete project");
      }
    } finally {
      setDeleting(false);
    }
  }

  // ── Upload helpers ────────────────────────────────────────────────────────
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
    try { setCoverImage(await uploadFile(file)); }
    catch (err: any) { setError(err.message); }
    finally { setCoverUploading(false); }
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    const placeholders = files.map(() => ({ url: "", caption: "", uploading: true }));
    const startIndex = gallery.length;
    setGallery(prev => [...prev, ...placeholders]);
    for (let i = 0; i < files.length; i++) {
      try {
        const url = await uploadFile(files[i]);
        setGallery(prev => { const next = [...prev]; next[startIndex + i] = { url, caption: "", uploading: false }; return next; });
      } catch {
        setGallery(prev => prev.filter((_, idx) => idx !== startIndex + i));
      }
    }
  }

  async function addTag() {
    if (!newTagName.trim()) return;
    try {
      const res = await fetch("/api/tags", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: newTagName.trim(), color: newTagColor }) });
      const data = await res.json();
      if (data.tag) { setTags(prev => [...prev, data.tag]); setNewTagName(""); }
    } catch {}
  }

  function toggleTag(id: string) {
    setSelectedTagIds(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const payload = {
        ...(editingId ? { id: editingId } : {}),
        ...form,
        stack: form.stack.split(",").map(s => s.trim()).filter(Boolean),
        failureScenarios: form.failureScenarios.split("\n").map(s => s.trim()).filter(Boolean),
        coverImage: coverImage ?? undefined,
        tagIds: selectedTagIds,
        galleryUrls: gallery.filter(g => g.url && !g.uploading).map(g => ({ url: g.url, caption: g.caption || undefined })),
        featured: form.featured,
        demoUrl: form.demoUrl || undefined,
      };

      const res = await fetch("/api/admin/projects", {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error ?? "Failed"); return; }

      setSuccess(editingId ? `"${data.project.title}" updated successfully!` : `"${data.project.title}" published!`);

      // Refresh project list
      const refreshed = await fetch("/api/projects").then(r => r.json());
      setProjects(refreshed.projects ?? []);

      if (!editingId) {
        setForm(EMPTY_FORM); setSelectedTagIds([]); setCoverImage(null); setGallery([]);
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  // ── Shared styles ─────────────────────────────────────────────────────────
  const tabStyle = (active: boolean) => ({
    fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 500,
    padding: "0.5rem 1.25rem", borderRadius: 8, cursor: "pointer", border: "none",
    background: active ? "var(--accent-green)" : "transparent",
    color: active ? "white" : "var(--text-secondary)",
    transition: "all 0.15s",
  });

  return (
    <div style={{ background: "var(--content-bg)", minHeight: "100vh" }}>
      {/* Header — grey zone */}
      <div style={{ background: "var(--hero-bg)", borderBottom: "1px solid var(--border-grey)", padding: "2rem 1.5rem 1.5rem" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <p className="eyebrow" style={{ marginBottom: "0.4rem" }}>Admin</p>
          <h1 className="display-heading" style={{ fontSize: "1.9rem", color: "var(--text-primary)", marginBottom: "0.3rem" }}>
            Project manager
          </h1>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
            Add, edit, or delete case study projects.
          </p>

          {/* Tab switcher */}
          <div style={{ display: "flex", gap: "0.35rem", background: "var(--border-grey)", borderRadius: 10, padding: "0.3rem", width: "fit-content" }}>
            <button type="button" style={tabStyle(activeTab === "list")} onClick={() => setActiveTab("list")}>
              All projects ({projects.length})
            </button>
            <button type="button" style={tabStyle(activeTab === "form")} onClick={resetForm}>
              {editingId ? "Edit project" : "Add new project"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>

        {/* ── Project list tab ── */}
        {activeTab === "list" && (
          <div>
            {listLoading ? (
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)", padding: "3rem 0", textAlign: "center" }}>
                Loading projects...
              </div>
            ) : projects.length === 0 ? (
              <div style={{ textAlign: "center", padding: "4rem 0" }}>
                <p style={{ fontFamily: "var(--font-mono)", color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1rem" }}>
                  No projects yet.
                </p>
                <button type="button" className="btn-cta" onClick={resetForm}>Add your first project</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {projects.map(project => (
                  <div key={project.id} style={{
                    background: "var(--card-bg)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "1.1rem 1.25rem",
                    display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap",
                  }}>
                    {/* Cover thumbnail */}
                    <div style={{
                      width: 64, height: 40, borderRadius: 6, flexShrink: 0,
                      background: "var(--card-bg-alt)", overflow: "hidden",
                      border: "1px solid var(--border)",
                    }}>
                      {project.coverImage && (
                        <img src={project.coverImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.2rem" }}>
                        <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.92rem", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {project.title}
                        </span>
                        {project.featured && (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.55rem", fontWeight: 500, background: "var(--accent-green)", color: "white", padding: "0.1rem 0.45rem", borderRadius: 999, flexShrink: 0 }}>
                            Featured
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>
                          /{project.slug}
                        </span>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                          {project.likeCount}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                      <Link
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 500,
                          padding: "0.4rem 0.85rem", borderRadius: 7,
                          border: "1.5px solid var(--border)", background: "transparent",
                          color: "var(--text-secondary)", textDecoration: "none",
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                        View
                      </Link>
                      <button
                        type="button"
                        onClick={() => startEdit(project)}
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 500,
                          padding: "0.4rem 0.85rem", borderRadius: 7,
                          border: "1.5px solid #bfdbfe", background: "#eff6ff",
                          color: "#1d4ed8", cursor: "pointer",
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(project.id!)}
                        style={{
                          fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 500,
                          padding: "0.4rem 0.85rem", borderRadius: 7,
                          border: "1.5px solid #fecaca", background: "#fef2f2",
                          color: "#dc2626", cursor: "pointer",
                          display: "inline-flex", alignItems: "center", gap: "0.3rem",
                        }}
                      >
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Delete confirmation modal ── */}
        {deleteId && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.35)", backdropFilter: "blur(3px)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
          }}
            onClick={() => setDeleteId(null)}
          >
            <div
              onClick={e => e.stopPropagation()}
              style={{
                background: "var(--card-bg)", border: "1px solid var(--border)",
                borderRadius: 14, padding: "2rem", maxWidth: 420, width: "100%",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              }}
            >
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#fef2f2", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.1rem", color: "var(--text-primary)", marginBottom: "0.5rem" }}>
                Delete this project?
              </h2>
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                This will permanently delete the project, all gallery images, likes, and comments. This cannot be undone.
              </p>
              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => confirmDelete(deleteId)}
                  disabled={deleting}
                  style={{
                    flex: 1, background: "#dc2626", color: "white", border: "none",
                    borderRadius: 999, padding: "0.65rem 1rem",
                    fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.875rem",
                    cursor: deleting ? "default" : "pointer", opacity: deleting ? 0.7 : 1,
                  }}
                >
                  {deleting ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="btn-ghost"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Form tab ── */}
        {activeTab === "form" && (
          <div ref={formRef}>
            {/* Edit banner */}
            {editingId && (
              <div style={{
                background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
                padding: "0.75rem 1rem", marginBottom: "1.25rem",
                display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem",
              }}>
                <span style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#1d4ed8" }}>
                  Editing: <strong>{form.title}</strong>
                </span>
                <button
                  type="button"
                  onClick={resetForm}
                  style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "#1d4ed8", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Cancel edit → Add new instead
                </button>
              </div>
            )}

            {success && (
              <div style={{ background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--accent-green)" }}>
                {success}
              </div>
            )}
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "0.75rem 1rem", marginBottom: "1.25rem", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "#dc2626" }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Section 1 — Identity */}
              <div className="form-section">
                <div className="form-section-title">Project identity</div>
                <div className="form-grid">
                  <div className="form-field">
                    <label className="label" htmlFor="title">Title *</label>
                    <input id="title" className="input" required value={form.title} onChange={e => update("title", e.target.value)} placeholder="CI/CD Multi-Tier Cloud System" />
                  </div>
                  <div className="form-field">
                    <label className="label" htmlFor="slug">Slug *</label>
                    <input id="slug" className="input" required value={form.slug} onChange={e => update("slug", e.target.value)} placeholder="cicd-cloud-system" />
                  </div>
                  <div className="form-field full">
                    <label className="label" htmlFor="description">Description *</label>
                    <textarea id="description" className="input" required value={form.description} onChange={e => update("description", e.target.value)} placeholder="Short summary shown on the project card..." style={{ minHeight: 72 }} />
                  </div>
                  <div className="form-field">
                    <label className="label" htmlFor="githubUrl">GitHub URL *</label>
                    <input id="githubUrl" className="input" required type="url" value={form.githubUrl} onChange={e => update("githubUrl", e.target.value)} placeholder="https://github.com/..." />
                  </div>
                  <div className="form-field">
                    <label className="label" htmlFor="demoUrl">Demo URL</label>
                    <input id="demoUrl" className="input" type="url" value={form.demoUrl} onChange={e => update("demoUrl", e.target.value)} placeholder="https://..." />
                  </div>
                  <div className="form-field full">
                    <label className="label" htmlFor="stack">Tech stack *</label>
                    <input id="stack" className="input" required value={form.stack} onChange={e => update("stack", e.target.value)} placeholder="AWS, ECS, RDS, Terraform, GitHub Actions" />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>Comma-separated</span>
                  </div>
                  <div className="form-field" style={{ flexDirection: "row", alignItems: "center", gap: "0.75rem" }}>
                    <input id="featured" type="checkbox" checked={form.featured} onChange={e => update("featured", e.target.checked)} style={{ width: 16, height: 16, accentColor: "var(--accent-green)" }} />
                    <label htmlFor="featured" style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-secondary)", cursor: "pointer" }}>Mark as featured</label>
                  </div>
                </div>
              </div>

              {/* Section 2 — Tags */}
              <div className="form-section">
                <div className="form-section-title">Tags</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                  {tags.map(tag => (
                    <button key={tag.id} type="button" onClick={() => toggleTag(tag.id)}
                      style={{
                        fontFamily: "var(--font-mono)", fontSize: "0.68rem", padding: "0.28rem 0.75rem",
                        borderRadius: 999, border: `1.5px solid ${selectedTagIds.includes(tag.id) ? tag.color : "var(--border-hover)"}`,
                        background: selectedTagIds.includes(tag.id) ? `${tag.color}22` : "transparent",
                        color: selectedTagIds.includes(tag.id) ? tag.color : "var(--text-secondary)", cursor: "pointer",
                      }}>
                      {selectedTagIds.includes(tag.id) ? "✓ " : ""}{tag.name}
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", flexWrap: "wrap" }}>
                  <input value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="New tag name" className="input" style={{ maxWidth: 180 }} />
                  <input type="color" value={newTagColor} onChange={e => setNewTagColor(e.target.value)} style={{ width: 36, height: 36, borderRadius: 6, border: "1px solid var(--border)", background: "none", cursor: "pointer", padding: 2 }} title="Tag color" />
                  <button type="button" onClick={addTag} className="btn-ghost">Add tag</button>
                </div>
              </div>

              {/* Section 3 — Cover image */}
              <div className="form-section">
                <div className="form-section-title">Cover image</div>
                {coverImage ? (
                  <div style={{ position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)", marginBottom: "0.75rem" }}>
                    <img src={coverImage} alt="Cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    <button type="button" onClick={() => setCoverImage(null)}
                      style={{ position: "absolute", top: 8, right: 8, background: "rgba(0,0,0,0.6)", color: "white", border: "none", borderRadius: 6, padding: "0.25rem 0.6rem", cursor: "pointer", fontSize: "0.75rem" }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div onClick={() => coverRef.current?.click()}
                    style={{ border: "2px dashed var(--border-hover)", borderRadius: 10, padding: "2rem", textAlign: "center", cursor: "pointer" }}>
                    {coverUploading ? (
                      <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>Uploading...</p>
                    ) : (
                      <>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" style={{ margin: "0 auto 0.5rem" }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--text-muted)" }}>Click to upload cover image</p>
                        <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>JPEG, PNG, WebP · max 5MB</p>
                      </>
                    )}
                  </div>
                )}
                <input ref={coverRef} type="file" accept="image/*" onChange={handleCoverUpload} style={{ display: "none" }} />
              </div>

              {/* Section 4 — Gallery */}
              <div className="form-section">
                <div className="form-section-title">Gallery images</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
                  {gallery.map((item, index) => (
                    <div key={index} style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", background: "var(--card-bg-alt)" }}>
                      <div style={{ aspectRatio: "16/9", position: "relative", background: "var(--card-bg-alt)" }}>
                        {item.uploading ? (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Uploading...</span>
                          </div>
                        ) : (
                          <img src={item.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        )}
                      </div>
                      <div style={{ padding: "0.4rem" }}>
                        <input value={item.caption} onChange={e => setGallery(prev => prev.map((g, i) => i === index ? { ...g, caption: e.target.value } : g))} placeholder="Caption (optional)" className="input" style={{ fontSize: "0.72rem", padding: "0.3rem 0.5rem" }} />
                      </div>
                      <button type="button" onClick={() => setGallery(prev => prev.filter((_, i) => i !== index))}
                        style={{ width: "100%", background: "#fef2f2", border: "none", borderTop: "1px solid var(--border)", color: "#dc2626", fontFamily: "var(--font-mono)", fontSize: "0.65rem", padding: "0.3rem", cursor: "pointer" }}>
                        Remove
                      </button>
                    </div>
                  ))}
                  <div onClick={() => galleryRef.current?.click()}
                    style={{ border: "2px dashed var(--border-hover)", borderRadius: 8, aspectRatio: "16/9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: "0.3rem" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>Add images</span>
                  </div>
                </div>
                <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleGalleryUpload} style={{ display: "none" }} />
              </div>

              {/* Section 5 — Case study content */}
              <div className="form-section">
                <div className="form-section-title">Case study content</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { key: "overview" as const, label: "Overview *", required: true, placeholder: "Problem statement and what you built..." },
                    { key: "architecture" as const, label: "Architecture *", required: true, placeholder: "How services interact..." },
                    { key: "ciCd" as const, label: "CI / CD pipeline *", required: true, placeholder: "Pipeline steps, tools, deployment process..." },
                    { key: "observability" as const, label: "Observability *", required: true, placeholder: "Logging, metrics, alerting..." },
                  ].map(({ key, label, required, placeholder }) => (
                    <div key={key} className="form-field">
                      <label className="label" htmlFor={key}>{label}</label>
                      <textarea id={key} className="input" required={required} value={form[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} style={{ minHeight: 90 }} />
                    </div>
                  ))}
                  <div className="form-field">
                    <label className="label" htmlFor="failureScenarios">Failure scenarios</label>
                    <textarea id="failureScenarios" className="input" value={form.failureScenarios} onChange={e => update("failureScenarios", e.target.value)} placeholder={"DB connection exhaustion: details. Resolution: fix.\nFailed deployment: details. Resolution: fix."} style={{ minHeight: 110 }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>One scenario per line.</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                <button type="submit" className="btn-cta" disabled={submitting} style={{ opacity: submitting ? 0.7 : 1, padding: "0.7rem 2rem" }}>
                  {submitting ? (editingId ? "Saving..." : "Publishing...") : (editingId ? "Save changes" : "Publish project")}
                </button>
                <button type="button" className="btn-ghost" onClick={resetForm}>
                  {editingId ? "Cancel" : "Reset form"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}