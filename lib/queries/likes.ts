import { db } from "@/lib/db";
import { likes, projects } from "@/lib/schema";
import { eq, and, sql } from "drizzle-orm";
import { createHash } from "crypto";

// Build a fingerprint from IP + user agent to prevent duplicate likes
// without requiring auth. Not bulletproof but good enough for a portfolio.
export function buildFingerprint(ip: string, userAgent: string): string {
  return createHash("sha256")
    .update(`${ip}:${userAgent}`)
    .digest("hex")
    .slice(0, 32);
}

export async function hasLiked(
  projectId: string,
  fingerprint: string
): Promise<boolean> {
  const existing = await db
    .select({ id: likes.id })
    .from(likes)
    .where(
      and(eq(likes.projectId, projectId), eq(likes.fingerprint, fingerprint))
    )
    .limit(1);

  return existing.length > 0;
}

export async function toggleLike(
  projectId: string,
  fingerprint: string
): Promise<{ liked: boolean; likeCount: number }> {
  const already = await hasLiked(projectId, fingerprint);

  if (already) {
    // Unlike
    await db
      .delete(likes)
      .where(
        and(eq(likes.projectId, projectId), eq(likes.fingerprint, fingerprint))
      );

    const [updated] = await db
      .update(projects)
      .set({ likeCount: sql`${projects.likeCount} - 1` })
      .where(eq(projects.id, projectId))
      .returning({ likeCount: projects.likeCount });

    return { liked: false, likeCount: updated?.likeCount ?? 0 };
  } else {
    // Like
    await db.insert(likes).values({ projectId, fingerprint });

    const [updated] = await db
      .update(projects)
      .set({ likeCount: sql`${projects.likeCount} + 1` })
      .where(eq(projects.id, projectId))
      .returning({ likeCount: projects.likeCount });

    return { liked: true, likeCount: updated?.likeCount ?? 0 };
  }
}