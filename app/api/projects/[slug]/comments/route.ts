import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug } from "@/lib/queries/projects";
import { getApprovedComments, createComment } from "@/lib/queries/comments";

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
    const data = await getApprovedComments(project.id);
    return NextResponse.json({ comments: data });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const project = await getProjectBySlug(params.slug);
    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const { authorName, authorEmail, body: commentBody } = body;

    if (!authorName?.trim() || !authorEmail?.trim() || !commentBody?.trim()) {
      return NextResponse.json(
        { error: "Name, email, and comment are required" },
        { status: 400 }
      );
    }

    if (commentBody.trim().length > 2000) {
      return NextResponse.json(
        { error: "Comment must be under 2000 characters" },
        { status: 400 }
      );
    }

    const comment = await createComment({
      projectId: project.id,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim().toLowerCase(),
      body: commentBody.trim(),
    });

    return NextResponse.json({ comment }, { status: 201 });
  } catch (error) {
    console.error(`[POST /api/projects/${params.slug}/comments]`, error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}