import { NextResponse } from "next/server";
import { copyProject } from "@/lib/apis/project/mongo/server";

type Params = Promise<{ id: string }>;

export async function POST(
  request: Request,
  { params }: { params: Params },
) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const name =
      typeof body?.name === "string" && body.name.trim().length > 0
        ? body.name.trim()
        : null;
    if (!name) {
      return NextResponse.json(
        { error: "A project name is required" },
        { status: 400 },
      );
    }
    const isPublic =
      typeof body?.isPublic === "boolean" ? body.isPublic : false;
    const project = await copyProject(id, name, isPublic);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project, { status: 201 });
  } catch (error: any) {
    if (error?.name === "ProjectAccessError") {
      return NextResponse.json({ error: "Project access denied" }, { status: 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
