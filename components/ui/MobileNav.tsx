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
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu on route change
  useEffect(() => { 
    setOpen(false); 
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { 
      document.body.style.overflow = ""; 
    };
  }, [open]);

  // Don't render on desktop
  if (!isMobile) {
    return null;
  }

  return (
    <>
      {/* Hamburger button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: open ? "var(--bg-secondary)" : "transparent",
          border: `1.5px solid ${open ? "var(--border-medium)" : "var(--border-light)"}`,
          borderRadius: 8,
          width: 40,
          height: 40,
          cursor: "pointer",
          color: "var(--text-primary)",
          transition: "all 0.2s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          if (!open) {
            e.currentTarget.style.background = "var(--bg-tertiary)";
            e.currentTarget.style.borderColor = "var(--border-medium)";
          }
        }}
        onMouseLeave={(e) => {
          if (!open) {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = "var(--border-light)";
          }
        }}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        )}
      </button>

      {/* Dark backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            top: 64,
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: 40,
            backdropFilter: "blur(3px)",
            animation: "fadeIn 0.2s ease",
          }}
          aria-hidden="true"
        />
      )}

      {/* Dark dropdown menu */}
      <div
        style={{
          position: "fixed",
          top: 64,
          left: 0,
          right: 0,
          zIndex: 41,
          background: "#1a1a1a",
          borderBottom: "1px solid #333333",
          maxHeight: open ? "500px" : "0",
          overflow: "hidden",
          transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: open ? "0 8px 32px rgba(0, 0, 0, 0.3)" : "none",
        }}
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div style={{ 
          padding: "1rem 1.25rem 1.5rem", 
          display: "flex", 
          flexDirection: "column", 
          gap: "0.25rem" 
        }}>
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
                    gap: "0.75rem",
                    padding: "0.875rem 1rem",
                    borderRadius: 8,
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: "#e5e5e5",
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#2a2a2a";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
                  </svg>
                  {label}
                  <span style={{ marginLeft: "auto", fontSize: "0.875rem", opacity: 0.6 }}>↗</span>
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
                  padding: "0.875rem 1rem",
                  borderRadius: 8,
                  fontFamily: "var(--font-body)",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: isActive ? "#60a5fa" : "#e5e5e5",
                  background: isActive ? "#1e3a5f" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "#2a2a2a";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                  }
                }}
              >
                {label}
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div style={{ 
            height: 1, 
            background: "#333333", 
            margin: "0.75rem 0 0.5rem" 
          }} />
          
          {/* Footer info */}
          <div style={{ 
            padding: "0.5rem 1rem", 
            fontFamily: "var(--font-mono)", 
            fontSize: "0.7rem", 
            color: "#888888",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem"
          }}>
            <span>iCampus DevOps Lab</span>
            <span style={{ opacity: 0.7 }}>© {new Date().getFullYear()} · Production Infrastructure</span>
          </div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}