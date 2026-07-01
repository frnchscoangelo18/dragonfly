import { NextResponse } from "next/server";
import { generateBomLogic } from "@/lib/apis/generate/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const specsContext = formData.get("specsContext") as string;
    const image = formData.get("image") as File | null;
    const generationTimestamp = formData.get("generationTimestamp") as string | null;

    if (!specsContext) {
      return NextResponse.json({ error: "Missing specsContext" }, { status: 400 });
    }

    const result = await generateBomLogic(specsContext, image, generationTimestamp ?? undefined);
    return NextResponse.json(result);
  } catch (error) {
    console.error("BOM Gen Error:", error);
    return NextResponse.json({ error: "Failed to generate BOM" }, { status: 500 });
  }
}
