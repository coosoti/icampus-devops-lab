import { NextRequest, NextResponse } from "next/server";
import { getAllTags, createTag } from "@/lib/queries/projects";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const tags = await getAllTags();
    return NextResponse.json({ tags });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch tags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get("admin_auth")?.value;
  if (cookie !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, color } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    const tag = await createTag(name.trim(), color ?? "#3b82f6");
    return NextResponse.json({ tag }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create tag" }, { status: 500 });
  }
}