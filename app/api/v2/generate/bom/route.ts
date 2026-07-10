import { generateBomLogic } from "@/lib/apis/generate/bomServer";
import { ProviderType } from "@/lib/ai/types";
import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/supabase/server";
import { getUserApiKeys } from "@/lib/settings/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const specsContext = formData.get("specsContext") as string;
    const image = formData.get("image") as File | null;
    const projectId = formData.get("projectId") as string;
    const providerType = formData.get("providerType") as "gemini" | "openai" | "openrouter" | "chatgpt" | null;
    const model = formData.get("model") as string | null;

    if (!specsContext) {
      return NextResponse.json(
        { error: "Missing specsContext" },
        { status: 400 },
      );
    }

    const resolvedProvider =
      (providerType as ProviderType) || ProviderType.GEMINI;
    const user = await getServerUser();
    const userApiKey = user
      ? (await getUserApiKeys(user.id))[resolvedProvider]
      : undefined;

    const result = await generateBomLogic(
      specsContext,
      image,
      projectId,
      undefined,
      resolvedProvider,
      model ?? undefined,
      userApiKey,
    );
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("BOM Gen Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate BOM" },
      { status: 500 },
    );
  }
}
