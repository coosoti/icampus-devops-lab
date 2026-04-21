"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/types/project";

interface GalleryProps {
  images: GalleryImage[];
  projectTitle: string;
}

export default function Gallery({ images, projectTitle }: GalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  /* Move focus into lightbox when it opens */
  useEffect(() => {
    if (lightboxIndex !== null) {
      closeBtnRef.current?.focus();
    }
  }, [lightboxIndex]);

  if (!images || images.length === 0) return null;

  const goPrev = () =>
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null));
  const goNext = () =>
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null));

  return (
    <section style={{ marginBottom: "3rem" }} aria-label="Project gallery">
      <h2 style={{
        fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.2rem",
        color: "var(--text-primary)", marginBottom: "0.4rem", letterSpacing: "-0.01em",
      }}>
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
            aria-label={`View image: ${img.caption ?? `${projectTitle} screenshot ${index + 1}`}`}
            className="card-lift"
            style={{
              position: "relative", width: "100%", aspectRatio: "16/9",
              borderRadius: 10, overflow: "hidden",
              border: "1px solid var(--border)",
              background: "var(--card-bg-alt)",   /* was var(--bg-secondary) */
              cursor: "pointer", padding: 0,
              transition: "border-color 0.2s, transform 0.2s",
            }}
          >
            <Image
              src={img.url}
              alt={img.caption ?? `${projectTitle} screenshot ${index + 1}`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
            {/* Caption overlay — always rendered, revealed on parent hover via group */}
            {img.caption && (
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "0.4rem 0.65rem",
                background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
                fontFamily: "var(--font-body)", fontSize: "0.72rem", color: "white",
                /* opacity controlled by CSS — see globals.css .gallery-caption */
              }}>
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
          aria-label={`Image viewer — ${images[lightboxIndex].caption ?? `Image ${lightboxIndex + 1} of ${images.length}`}`}
          onKeyDown={(e) => {
            if (e.key === "Escape") setLightboxIndex(null);
            if (e.key === "ArrowLeft") goPrev();
            if (e.key === "ArrowRight") goNext();
          }}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.92)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1rem",
          }}
        >
          {/* Backdrop click to close */}
          <div
            onClick={() => setLightboxIndex(null)}
            aria-hidden="true"
            style={{ position: "absolute", inset: 0 }}
          />

          {/* Image */}
          <div
            style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh", width: "100%", aspectRatio: "16/9", zIndex: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex].url}
              alt={images[lightboxIndex].caption ?? `${projectTitle} image ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              style={{ objectFit: "contain" }}
              priority
            />
          </div>

          {/* Caption */}
          {images[lightboxIndex].caption && (
            <div style={{
              position: "absolute", bottom: "4rem", left: "50%", transform: "translateX(-50%)",
              fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "rgba(255,255,255,0.8)",
              background: "rgba(0,0,0,0.6)", borderRadius: 6, padding: "0.3rem 0.8rem",
              whiteSpace: "nowrap", zIndex: 2,
            }}>
              {images[lightboxIndex].caption}
            </div>
          )}

          {/* Close — receives focus on open */}
          <button
            ref={closeBtnRef}
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="Close image viewer"
            style={{
              position: "absolute", top: "1rem", right: "1rem", zIndex: 2,
              background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.85)", fontSize: "1.1rem",
              cursor: "pointer", lineHeight: 1, borderRadius: 6,
              width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            ✕
          </button>

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
                aria-label="Previous image"
                style={{
                  position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 2,
                  background: "rgba(0,0,0,0.5)", border: "none", color: "white",
                  fontSize: "1.5rem", cursor: "pointer", borderRadius: "50%",
                  width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ‹
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
                aria-label="Next image"
                style={{
                  position: "absolute", right: "1rem", top: "50%", transform: "translateY(-50%)", zIndex: 2,
                  background: "rgba(0,0,0,0.5)", border: "none", color: "white",
                  fontSize: "1.5rem", cursor: "pointer", borderRadius: "50%",
                  width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                ›
              </button>

              <div
                aria-live="polite"
                aria-atomic="true"
                style={{
                  position: "absolute", bottom: "1rem", left: "50%", transform: "translateX(-50%)", zIndex: 2,
                  fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "rgba(255,255,255,0.5)",
                }}
              >
                {lightboxIndex + 1} / {images.length}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}