import { db } from "@/lib/db";
import { projects, projectTags, tags, galleryImages, comments, likes } from "@/lib/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";
import type { ProjectWithRelations } from "@/types/project";

// ── Helpers ────────────────────────────────────────────────────────────────────

function serialize(row: typeof projects.$inferSelect): typeof row {
  return {
    ...row,
    createdAt: new Date(row.createdAt),
    updatedAt: new Date(row.updatedAt),
  };
}

// ── Read ───────────────────────────────────────────────────────────────────────

export async function getAllProjects() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));

  return rows.map(serialize);
}

export async function getFeaturedProjects() {
  const rows = await db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(desc(projects.createdAt));

  return rows.map(serialize);
}

export async function getProjectBySlug(
  slug: string
): Promise<ProjectWithRelations | null> {
  const project = await db.query.projects.findFirst({
    where: eq(projects.slug, slug),
    with: {
      projectTags: { with: { tag: true } },
      gallery: { orderBy: galleryImages.position },
      comments: {
        where: eq(comments.approved, true),
        orderBy: desc(comments.createdAt),
      },
    },
  });

  if (!project) return null;

  const commentCount = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(comments)
    .where(eq(comments.projectId, project.id))
    .then((r) => r[0]?.count ?? 0);

  return {
    ...serialize(project),
    tags: project.projectTags.map((pt) => pt.tag),
    gallery: project.gallery,
    commentCount,
  };
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const rows = await db.select({ slug: projects.slug }).from(projects);
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}

export async function getProjectsByTag(tagName: string) {
  const tag = await db.query.tags.findFirst({
    where: eq(tags.name, tagName),
  });

  if (!tag) return [];

  const projectIds = await db
    .select({ projectId: projectTags.projectId })
    .from(projectTags)
    .where(eq(projectTags.tagId, tag.id));

  if (projectIds.length === 0) return [];

  const ids = projectIds.map((r) => r.projectId);
  const rows = await db
    .select()
    .from(projects)
    .where(inArray(projects.id, ids))
    .orderBy(desc(projects.createdAt));

  return rows.map(serialize);
}

export async function getAllTags() {
  return db.select().from(tags).orderBy(tags.name);
}

// ── Write (admin) ──────────────────────────────────────────────────────────────

export async function createProject(data: {
  title: string;
  slug: string;
  description: string;
  coverImage?: string;
  stack: string[];
  overview: string;
  architecture: string;
  ciCd: string;
  observability: string;
  failureScenarios: string[];
  githubUrl: string;
  demoUrl?: string;
  featured: boolean;
  tagIds: string[];
  galleryUrls: { url: string; caption?: string }[];
}) {
  const { tagIds, galleryUrls, ...projectData } = data;

  const [project] = await db
    .insert(projects)
    .values({
      ...projectData,
      demoUrl: projectData.demoUrl || null,
      coverImage: projectData.coverImage || null,
    })
    .returning();

  if (tagIds.length > 0) {
    await db.insert(projectTags).values(
      tagIds.map((tagId) => ({ projectId: project.id, tagId }))
    );
  }

  if (galleryUrls.length > 0) {
    await db.insert(galleryImages).values(
      galleryUrls.map((img, i) => ({
        projectId: project.id,
        url: img.url,
        caption: img.caption ?? null,
        position: i,
      }))
    );
  }

  return project;
}

export async function updateProject(
  id: string,
  data: Partial<typeof projects.$inferInsert> & {
    tagIds?: string[];
    galleryUrls?: { url: string; caption?: string }[];
  }
) {
  const { tagIds, galleryUrls, ...projectData } = data;

  const [updated] = await db
    .update(projects)
    .set({ ...projectData, updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  if (tagIds !== undefined) {
    await db.delete(projectTags).where(eq(projectTags.projectId, id));
    if (tagIds.length > 0) {
      await db.insert(projectTags).values(
        tagIds.map((tagId) => ({ projectId: id, tagId }))
      );
    }
  }

  if (galleryUrls !== undefined) {
    await db.delete(galleryImages).where(eq(galleryImages.projectId, id));
    if (galleryUrls.length > 0) {
      await db.insert(galleryImages).values(
        galleryUrls.map((img, i) => ({
          projectId: id,
          url: img.url,
          caption: img.caption ?? null,
          position: i,
        }))
      );
    }
  }

  return updated;
}

export async function deleteProject(id: string) {
  await db.delete(projects).where(eq(projects.id, id));
}

export async function createTag(name: string, color: string) {
  const [tag] = await db
    .insert(tags)
    .values({ name, color })
    .onConflictDoNothing()
    .returning();
  return tag;
}