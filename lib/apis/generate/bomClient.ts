import { GeneratedBOM } from "@/lib/apis/generate/types";

export async function generateBOM(
  specsContext: string,
  image: File | null,
  generationTimestamp: string,
): Promise<GeneratedBOM> {
  const formData = new FormData();
  formData.append("specsContext", specsContext);
  formData.append("generationTimestamp", generationTimestamp);
  if (image) formData.append("image", image);

  const response = await fetch("/api/v2/generate/bom", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error || "Failed to generate BOM";
    throw new Error(message);
  }
  return await response.json();
}
