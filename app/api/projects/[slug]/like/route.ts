import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/queries/projects";
import { toggleLike, hasLiked, buildFingerprint } from "@/lib/queries/likes";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await getProjectBySlug(params.slug);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const ua = request.headers.get("user-agent") ?? "unknown";
    const fingerprint = buildFingerprint(ip, ua);

    const result = await toggleLike(project.id, fingerprint);

    return NextResponse.json(result);
  } catch (error) {
    console.error(`[POST /api/projects/${params.slug}/like]`, error);
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await getProjectBySlug(params.slug);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const ua = request.headers.get("user-agent") ?? "unknown";
    const fingerprint = buildFingerprint(ip, ua);

    const liked = await hasLiked(project.id, fingerprint);

    return NextResponse.json({ liked, likeCount: project.likeCount });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get like status" }, { status: 500 });
  }
}