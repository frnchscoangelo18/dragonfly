import { GeneratedSpecs } from "@/lib/apis/generate/types";
import { getOrCreateDeviceId } from "@/lib/device";
import { ProviderType } from "@/lib/ai/types";

export async function generateSpecs(
  prompt: string | null,
  image: File | null,
  providerType?: ProviderType,
  model?: string,
): Promise<GeneratedSpecs> {
  const formData = new FormData();
  if (prompt) formData.append("prompt", prompt);
  if (image) formData.append("image", image);
  if (providerType) formData.append("providerType", providerType);
  if (model) formData.append("model", model);

  const response = await fetch("/api/v2/generate/specs", {
    method: "POST",
    headers: { "x-device-id": getOrCreateDeviceId() },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to generate specs");
  return await response.json();
}
