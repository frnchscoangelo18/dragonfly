import { GeneratedFlow } from "@/lib/apis/generate/types";
import { getOrCreateDeviceId } from "@/lib/device";
import { ProviderType } from "@/lib/ai/types";

export async function generateVisualFlow(
  bomComponentsContext: string,
  specsContext: string,
  prompt: string | null,
  image: File | null,
  projectId: string,
  providerType?: ProviderType,
  model?: string,
): Promise<GeneratedFlow> {
  const formData = new FormData();
  formData.append("bomComponentsContext", bomComponentsContext);
  formData.append("specsContext", specsContext);
  if (prompt) formData.append("prompt", prompt);
  if (image) formData.append("image", image);
  formData.append("projectId", projectId);
  if (providerType) formData.append("providerType", providerType);
  if (model) formData.append("model", model);

  const response = await fetch("/api/v2/generate/visual-flow", {
    method: "POST",
    headers: { "x-device-id": getOrCreateDeviceId() },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to generate visual flow";
    throw new Error(message);
  }
  return response.json();
}
