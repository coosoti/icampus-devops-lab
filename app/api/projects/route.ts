import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, getProjectsByTag } from "@/lib/queries/projects";

import {
  createProject,
  updateProject,
  deleteProject,
  createTag,
} from "@/lib/queries/projects";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_auth")?.value;
  return cookie === process.env.ADMIN_PASSWORD;
}

// ── Shared payload parser ──────────────────────────────────────────────────
// The admin form sends camelCase keys (ciCd, githubUrl etc.).
// This normalises them into what createProject / updateProject expect.
function parsePayload(body: any) {
  return {
    title: body.title?.trim(),
    slug: body.slug?.trim(),
    description: body.description?.trim() ?? "",
    coverImage: body.coverImage || undefined,
    stack: Array.isArray(body.stack)
      ? body.stack
      : (body.stack ?? "").split(",").map((s: string) => s.trim()).filter(Boolean),
    overview: body.overview?.trim() ?? "",
    architecture: body.architecture?.trim() ?? "",
    ciCd: body.ciCd?.trim() ?? "",
    observability: body.observability?.trim() ?? "",
    failureScenarios: Array.isArray(body.failureScenarios)
      ? body.failureScenarios
      : (body.failureScenarios ?? "")
          .split("\n")
          .map((s: string) => s.trim())
          .filter(Boolean),
    githubUrl: body.githubUrl?.trim() ?? "",
    demoUrl: body.demoUrl?.trim() || undefined,
    featured: body.featured ?? false,
    tagIds: Array.isArray(body.tagIds) ? body.tagIds : [],
    galleryUrls: Array.isArray(body.galleryUrls) ? body.galleryUrls : [],
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag") ?? undefined;

    const data = tag ? await getProjectsByTag(tag) : await getAllProjects();

    return NextResponse.json({ projects: data });
  } catch (error) {
    console.error("[GET /api/projects]", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

// ── POST — create project ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const data = parsePayload(body);

    if (!data.title || !data.slug) {
      return NextResponse.json(
        { error: "Title and slug are required" },
        { status: 400 }
      );
    }

    const project = await createProject(data);
    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/admin/projects]", error);
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}

// ── PUT — update project ───────────────────────────────────────────────────
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Project id is required" },
        { status: 400 }
      );
    }

    const data = parsePayload(body);
    const project = await updateProject(id, data);

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error("[PUT /api/admin/projects]", error);
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "A project with this slug already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update project" },
      { status: 500 }
    );
  }
}

// ── DELETE — delete project ────────────────────────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Project id is required" },
        { status: 400 }
      );
    }

    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[DELETE /api/admin/projects]", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}