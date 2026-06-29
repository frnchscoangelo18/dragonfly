import { NextResponse } from "next/server";
import { generateBomLogic } from "@/lib/apis/generate/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const prompt = formData.get("prompt") as string | null;
    const image = formData.get("image") as File | null;

    if (!prompt && !image) {
      return NextResponse.json(
        { error: "Missing prompt or image" },
        { status: 400 },
      );
    }

    const result = await generateBomLogic(prompt, image);

    return NextResponse.json(result);
  } catch (error) {
    console.error("BOM Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate BOM" },
      { status: 500 },
    );
  }
}
