import { GeneratedBOM } from "@/lib/apis/generate/types";
import { getOrCreateDeviceId } from "@/lib/device";
import { ProviderType } from "@/lib/ai/types";

export async function generateBOM(
  specsContext: string,
  image: File | null,
  projectId: string,
  providerType?: ProviderType,
  model?: string,
): Promise<GeneratedBOM> {
  const formData = new FormData();
  formData.append("specsContext", specsContext);
  formData.append("projectId", projectId);
  if (image) formData.append("image", image);
  if (providerType) formData.append("providerType", providerType);
  if (model) formData.append("model", model);

  const response = await fetch("/api/v2/generate/bom", {
    method: "POST",
    headers: { "x-device-id": getOrCreateDeviceId() },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to generate BOM";
    throw new Error(message);
  }
  return await response.json();
}
