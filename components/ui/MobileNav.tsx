"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Admin", href: "/admin" },
  { label: "GitHub", href: "https://github.com/coosoti/icampus-devops-lab", external: true },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — only visible on mobile */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        style={{
          display: "none", // shown via CSS at mobile breakpoint
          background: "none",
          border: "1.5px solid var(--border-hover)",
          borderRadius: 8,
          padding: "0.4rem 0.5rem",
          cursor: "pointer",
          color: "var(--text-primary)",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="hamburger-btn"
      >
        {open ? (
          // X icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          // Hamburger icon
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: 62,
            background: "rgba(0,0,0,0.6)",
            zIndex: 40,
            backdropFilter: "blur(2px)",
          }}
          aria-hidden="true"
        />
      )}

      {/* Dropdown menu */}
      <div
        style={{
          position: "fixed",
          top: 62,
          left: 0,
          right: 0,
          zIndex: 41,
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          padding: open ? "0.75rem 0 1rem" : "0",
          maxHeight: open ? "400px" : "0",
          overflow: "hidden",
          transition: "max-height 0.25s ease, padding 0.25s ease",
        }}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div style={{ padding: "0 1.25rem", display: "flex", flexDirection: "column", gap: "0.15rem" }}>
          {NAV_LINKS.map(({ label, href, external }) => {
            const isActive = !external && pathname === href;

            if (external) {
              return (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.6rem",
                    padding: "0.75rem 0.85rem",
                    borderRadius: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: "0.9rem",
                    color: "var(--text-secondary)",
                    textDecoration: "none",
                    transition: "background 0.15s, color 0.15s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                    (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  {label} ↗
                </a>
              );
            }

            return (
              <Link
                key={label}
                href={href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.75rem 0.85rem",
                  borderRadius: 8,
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: isActive ? "var(--accent-blue-bright)" : "var(--text-secondary)",
                  background: isActive ? "rgba(59,130,246,0.08)" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.15s, color 0.15s",
                  borderLeft: isActive ? "2px solid var(--accent-blue)" : "2px solid transparent",
                }}
              >
                {label}
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </Link>
            );
          })}

          {/* Divider + version tag */}
          <div style={{ height: 1, background: "var(--border)", margin: "0.5rem 0" }} />
          <div style={{ padding: "0.25rem 0.85rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)" }}>
            iCampus DevOps Lab · {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </>
  );
}