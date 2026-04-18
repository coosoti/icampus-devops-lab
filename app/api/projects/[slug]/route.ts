import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await getProjectBySlug(params.slug);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ project });
  } catch (error) {
    console.error(`[GET /api/projects/${params.slug}]`, error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}