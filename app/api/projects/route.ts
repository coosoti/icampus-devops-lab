import { NextRequest, NextResponse } from "next/server";
import { getAllProjects, getProjectsByTag } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

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