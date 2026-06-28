import { NextResponse } from "next/server";
import {
  getComponentById,
  updateComponent,
  deleteComponent,
} from "@/lib/inventory/json/server";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const component = await getComponentById(id);
  if (!component) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }
  return NextResponse.json(component);
}

export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const component = await updateComponent(id, body);
    if (!component) {
      return NextResponse.json(
        { error: "Component not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(component);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update component" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  const success = await deleteComponent(id);
  if (!success) {
    return NextResponse.json({ error: "Component not found" }, { status: 404 });
  }
  return new NextResponse(null, { status: 204 });
}
