import { db } from "@/lib/db";
import { comments } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function getApprovedComments(projectId: string) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.projectId, projectId))
    .orderBy(desc(comments.createdAt));
}

export async function getAllComments(projectId: string) {
  return db
    .select()
    .from(comments)
    .where(eq(comments.projectId, projectId))
    .orderBy(desc(comments.createdAt));
}

export async function createComment(data: {
  projectId: string;
  authorName: string;
  authorEmail: string;
  body: string;
}) {
  const [comment] = await db
    .insert(comments)
    .values({ ...data, approved: true }) // auto-approve for MVP; set false for moderation
    .returning();
  return comment;
}

export async function approveComment(id: string) {
  const [comment] = await db
    .update(comments)
    .set({ approved: true })
    .where(eq(comments.id, id))
    .returning();
  return comment;
}

export async function deleteComment(id: string) {
  await db.delete(comments).where(eq(comments.id, id));
}