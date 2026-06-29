import { NextResponse } from "next/server";
import { getAllItems, createItem } from "@/lib/apis/inventory/json/server";

export async function GET() {
  const components = await getAllItems();
  return NextResponse.json(components);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const component = await createItem(body);
    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create component" },
      { status: 500 },
    );
  }
}
