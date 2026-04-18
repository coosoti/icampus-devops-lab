import type { Tag } from "@/types/project";

interface StackBadgeProps {
  tag: Tag | { name: string; color: string };
  size?: "sm" | "md";
  onClick?: () => void;
  active?: boolean;
}

export default function StackBadge({
  tag,
  size = "sm",
  onClick,
  active = false,
}: StackBadgeProps) {
  const color = tag.color ?? "#3b82f6";

  const style: React.CSSProperties = {
    color: active ? "#fff" : color,
    background: active ? color : `${color}18`,
    borderColor: `${color}60`,
    fontFamily: "var(--font-mono)",
    fontSize: size === "md" ? "0.72rem" : "0.62rem",
    fontWeight: 500,
    padding: size === "md" ? "0.25rem 0.75rem" : "0.15rem 0.5rem",
    borderRadius: 999,
    border: "1px solid",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    cursor: onClick ? "pointer" : "default",
    transition: "all 0.15s",
    letterSpacing: "0.04em",
    whiteSpace: "nowrap" as const,
  };

  if (onClick) {
    return (
      <button type="button" onClick={onClick} style={style} aria-pressed={active}>
        {tag.name}
      </button>
    );
  }

  return <span style={style}>{tag.name}</span>;
}