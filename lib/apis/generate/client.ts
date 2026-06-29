const API_BASE = "/api/v1/generate";

export async function generateBOM(prompt: string | null, image: File | null) {
  const formData = new FormData();
  if (prompt) formData.append("prompt", prompt);
  if (image) formData.append("image", image);

  const response = await fetch(API_BASE, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to generate BOM");
  return await response.json();
}
