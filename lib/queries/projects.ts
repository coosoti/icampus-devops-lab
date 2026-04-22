import { db } from "@/lib/db";
import {
  projects,
  projectTags,
  tags,
  galleryImages,
  comments,
  likes,
} from "@/lib/schema";
import { eq, desc, sql, inArray } from "drizzle-orm";
import type { ProjectWithRelations } from "@/types/project";

// ── Read ───────────────────────────────────────────────────────────────────

export async function getAllProjects() {
  const rows = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.createdAt));
  return rows;
}

export async function getFeaturedProjects() {
  return db
    .select()
    .from(projects)
    .where(eq(projects.featured, true))
    .orderBy(desc(projects.createdAt));
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
    ...project,
    tags: project.projectTags.map((pt: any) => pt.tag),
    gallery: project.gallery,
    commentCount,
  };
}

export async function getAllProjectSlugs(): Promise<string[]> {
  try {
    const rows = await db
      .select({ slug: projects.slug })
      .from(projects);
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
  return db
    .select()
    .from(projects)
    .where(inArray(projects.id, ids))
    .orderBy(desc(projects.createdAt));
}

export async function getAllTags() {
  return db.select().from(tags).orderBy(tags.name);
}

// ── Write ──────────────────────────────────────────────────────────────────

interface ProjectData {
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
}

export async function createProject(data: ProjectData) {
  const { tagIds, galleryUrls, ...projectData } = data;

  const [project] = await db
    .insert(projects)
    .values({
      title: projectData.title,
      slug: projectData.slug,
      description: projectData.description,
      coverImage: projectData.coverImage ?? null,
      stack: projectData.stack,
      overview: projectData.overview,
      architecture: projectData.architecture,
      ciCd: projectData.ciCd,
      observability: projectData.observability,
      failureScenarios: projectData.failureScenarios,
      githubUrl: projectData.githubUrl,
      demoUrl: projectData.demoUrl ?? null,
      featured: projectData.featured,
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

export async function updateProject(id: string, data: Partial<ProjectData>) {
  const { tagIds, galleryUrls, ...rest } = data;

  // Build explicit update object so Drizzle maps camelCase → snake_case correctly
  const updateValues: Record<string, any> = {
    updatedAt: new Date(),
  };

  if (rest.title !== undefined) updateValues.title = rest.title;
  if (rest.slug !== undefined) updateValues.slug = rest.slug;
  if (rest.description !== undefined) updateValues.description = rest.description;
  if (rest.coverImage !== undefined) updateValues.coverImage = rest.coverImage ?? null;
  if (rest.stack !== undefined) updateValues.stack = rest.stack;
  if (rest.overview !== undefined) updateValues.overview = rest.overview;
  if (rest.architecture !== undefined) updateValues.architecture = rest.architecture;
  if (rest.ciCd !== undefined) updateValues.ciCd = rest.ciCd;
  if (rest.observability !== undefined) updateValues.observability = rest.observability;
  if (rest.failureScenarios !== undefined) updateValues.failureScenarios = rest.failureScenarios;
  if (rest.githubUrl !== undefined) updateValues.githubUrl = rest.githubUrl;
  if (rest.demoUrl !== undefined) updateValues.demoUrl = rest.demoUrl ?? null;
  if (rest.featured !== undefined) updateValues.featured = rest.featured;

  const [updated] = await db
    .update(projects)
    .set(updateValues)
    .where(eq(projects.id, id))
    .returning();

  // Replace tags if provided
  if (tagIds !== undefined) {
    await db.delete(projectTags).where(eq(projectTags.projectId, id));
    if (tagIds.length > 0) {
      await db.insert(projectTags).values(
        tagIds.map((tagId) => ({ projectId: id, tagId }))
      );
    }
  }

  // Replace gallery if provided
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