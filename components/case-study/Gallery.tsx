"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/project";

interface GalleryProps {
  images: GalleryImage[];
  projectTitle: string;
}

export default function Gallery({ images, projectTitle }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  const goPrev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const goNext = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  return (
    <section style={{ marginBottom: "3rem" }}>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem", color: "var(--text-primary)", marginBottom: "0.4rem", letterSpacing: "-0.01em" }}>
        Gallery
      </h2>
      <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--text-muted)", marginBottom: "1.25rem" }}>
        Screenshots, architecture diagrams, and observability dashboards.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "0.85rem" }}>
        {images.map((img, index) => (
          <button
            key={img.id}
            type="button"
            onClick={() => setLightboxIndex(index)}
            style={{
              position: "relative",
              width: "100%",
              aspectRatio: "16/9",
              borderRadius: 10,
              overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--bg-secondary)",
              cursor: "pointer",
              padding: 0,
              transition: "border-color 0.2s, transform 0.2s",
            }}
            className="card-lift"
            aria-label={`View ${img.caption ?? `image ${index + 1}`}`}
          >
            <Image
              src={img.url}
              alt={img.caption ?? `${projectTitle} screenshot ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
            {img.caption && (
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0.4rem 0.65rem", background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "white", opacity: 0, transition: "opacity 0.2s" }}
                className="gallery-caption">
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightboxIndex(null)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
          }}
          tabIndex={-1}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh", width: "100%", aspectRatio: "16/9" }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption ?? `Image ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Caption */}
          {images[lightboxIndex].caption && (
            <div style={{ position: "absolute", bottom: "4rem", left: "50%", transform: "translateX(-50%)", fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(255,255,255,0.7)", background: "rgba(0,0,0,0.5)", borderRadius: 6, padding: "0.3rem 0.8rem", whiteSpace: "nowrap" }}>
              {images[lightboxIndex].caption}
            </div>
          )}

          {/* Close */}
          <button type="button" onClick={() => setLightboxIndex(null)} aria-label="Close"
            style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", color: "rgba(255,255,255,0.7)", fontSize: "1.4rem", cursor: "pointer", lineHeight: 1 }}>
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button type="button" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous"
                style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                ‹
              </button>
              <button type="button" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next"
                style={{ position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "white", fontSize: "1.5rem", cursor: "pointer", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                ›
              </button>
              <div style={{ position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)" }}>
                {lightboxIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}