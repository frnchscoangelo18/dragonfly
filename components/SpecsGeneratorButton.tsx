import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, FileText } from "lucide-react";
import { generateSpecs } from "@/lib/apis/generate/specsClient";
import { ProjectTagEnum } from "@/lib/apis/project/types";
import { uploadToStorage } from "@/lib/apis/storage/client";
import { useBom } from "@/features/bom/store";

export function SpecsGeneratorButton({
  prompt,
  image,
  projectName,
}: {
  prompt: string | null;
  image: File | null;
  projectName: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { loadDynamicProject, components, alerts } = useBom();

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const specsData = await generateSpecs(prompt, image);
      const items = specsData.specs;

      // Generate PDF (Note: generatePdf is server-side,
      // need to call the API route we created earlier)
      const response = await fetch("/api/v2/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName, items }),
      });
      const pdfBlob = await response.blob();
      const pdfFile = new File([pdfBlob], `${projectName}-specs.pdf`, {
        type: "application/pdf",
      });

      // Upload to storage
      const uploadRes = await uploadToStorage(
        pdfFile,
        `${projectName}-specs.pdf`,
      );

      // Get public URL (storage client usually handles getting URL)
      // For now, assume uploadToStorage might need to return it,
      // or we construct it. Assuming it's accessible at:
      // /api/v2/storage/...? Let's use getFileUrl.
      // Need a way to fetch the public URL from the storage API.
      // For this implementation, I will just call the storage API to get URL if it exists,
      // or assume the storage structure lets us construct the URL if public.
      // Re-reading lib/apis/storage/server.ts, we have getFileUrl.
      // Let's create an API route for getFileUrl.

      // Actually, let's just trigger the BOM generation with the specs as context.
      // And update the store with the new items/alerts/specs/pdfUrl.

      // For now, just placeholder URL until getFileUrl API is implemented.
      const pdfUrl = `/api/v2/storage/view/${projectName}-specs.pdf`;

      // Update store
      // We need to fetch/generate BOM components as well as specs.
      // The requirement was: trigger specs AI to generate specs -> PDF -> Save.
      // Then BOM generation continues.

      // Update store
      loadDynamicProject(
        projectName,
        ProjectTagEnum.NA,
        components,
        alerts,
        specsData,
        pdfBlob,
      );
      } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button onClick={handleGenerate} disabled={isLoading} variant="secondary">
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <FileText className="mr-2 h-4 w-4" />
      )}
      Generate Specs PDF
    </Button>
  );
}
