import { NextRequest, NextResponse } from "next/server";
import { createProject, updateProject, deleteProject, createTag } from "@/lib/queries/projects";

function isAuthorized(request: NextRequest): boolean {
  const cookie = request.cookies.get("admin_auth")?.value;
  return cookie === process.env.ADMIN_PASSWORD;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const project = await createProject({
      title: body.title,
      slug: body.slug,
      description: body.description,
      coverImage: body.coverImage || undefined,
      stack: body.stack,
      overview: body.overview,
      architecture: body.architecture,
      ciCd: body.ciCd,
      observability: body.observability,
      failureScenarios: body.failureScenarios,
      githubUrl: body.githubUrl,
      demoUrl: body.demoUrl || undefined,
      featured: body.featured ?? false,
      tagIds: body.tagIds ?? [],
      galleryUrls: body.galleryUrls ?? [],
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/admin/projects]", error);
    if (error?.code === "23505") {
      return NextResponse.json({ error: "A project with this slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...data } = body;

    const project = await updateProject(id, data);
    return NextResponse.json({ project });
  } catch (error) {
    console.error("[PUT /api/admin/projects]", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await deleteProject(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}