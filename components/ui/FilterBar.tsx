"use client";

import type { Tag } from "@/types/project";
import StackBadge from "./StackBadge";

interface FilterBarProps {
  tags: Tag[];
  activeTag: string | null;
  onChange: (tag: string | null) => void;
}

export default function FilterBar({ tags, activeTag, onChange }: FilterBarProps) {
  return (
    <div
      role="group"
      aria-label="Filter projects by tag"
      style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem" }}
    >
      <button
        type="button"
        onClick={() => onChange(null)}
        aria-pressed={activeTag === null}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.72rem",
          fontWeight: 500,
          padding: "0.25rem 0.85rem",
          borderRadius: 999,
          border: `1.5px solid ${activeTag === null ? "var(--text-primary)" : "var(--border-hover)"}`,
          background: activeTag === null ? "var(--text-primary)" : "transparent",
          color: activeTag === null ? "var(--card-bg)" : "var(--text-secondary)", /* was var(--bg-primary) — didn't exist */
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        All
      </button>

      {tags.map((tag) => (
        <StackBadge
          key={tag.id}
          tag={tag}
          size="md"
          active={activeTag === tag.name}
          onClick={() => onChange(activeTag === tag.name ? null : tag.name)}
        />
      ))}
    </div>
  );
}