"use client";

import { useState, useEffect } from "react";

interface LikeButtonProps {
  slug: string;
  initialCount: number;
}

export default function LikeButton({ slug, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  // Check if user has already liked on mount
  useEffect(() => {
    fetch(`/api/projects/${slug}/like`)
      .then((r) => r.json())
      .then((data) => {
        setLiked(data.liked ?? false);
        setCount(data.likeCount ?? initialCount);
        setChecked(true);
      })
      .catch(() => setChecked(true));
  }, [slug, initialCount]);

  async function handleLike() {
    if (loading) return;

    // Optimistic update
    setLiked((prev) => !prev);
    setCount((prev) => (liked ? prev - 1 : prev + 1));
    setLoading(true);

    try {
      const res = await fetch(`/api/projects/${slug}/like`, { method: "POST" });
      const data = await res.json();
      setLiked(data.liked);
      setCount(data.likeCount);
    } catch {
      // Revert on error
      setLiked((prev) => !prev);
      setCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={!checked || loading}
      aria-label={liked ? "Unlike this project" : "Like this project"}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        padding: "0.55rem 1.2rem",
        borderRadius: 999,
        border: `1.5px solid ${liked ? "#ef4444" : "var(--border-hover)"}`,
        background: liked ? "rgba(239,68,68,0.1)" : "transparent",
        color: liked ? "#ef4444" : "var(--text-secondary)",
        fontFamily: "var(--font-body)",
        fontSize: "0.85rem",
        fontWeight: 500,
        cursor: checked && !loading ? "pointer" : "default",
        transition: "all 0.2s",
        opacity: !checked ? 0.5 : 1,
      }}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill={liked ? "#ef4444" : "none"}
        stroke={liked ? "#ef4444" : "currentColor"}
        strokeWidth="2"
        style={{ transition: "all 0.2s" }}
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count} {count === 1 ? "like" : "likes"}
    </button>
  );
}