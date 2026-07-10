import { GeneratedSpecs } from "@/lib/apis/generate/types";
import { getOrCreateDeviceId } from "@/lib/device";

export async function generateSpecs(prompt: string | null, image: File | null): Promise<GeneratedSpecs> {
  const formData = new FormData();
  if (prompt) formData.append("prompt", prompt);
  if (image) formData.append("image", image);

  const response = await fetch("/api/v2/generate/specs", {
    method: "POST",
    headers: { "x-device-id": getOrCreateDeviceId() },
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to generate specs");
  return await response.json();
}
