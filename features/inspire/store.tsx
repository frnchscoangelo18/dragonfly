"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { generateBOM } from "@/lib/apis/generate/client";
import { generateSpecs } from "@/lib/apis/generate/specsClient";
import { downloadReport } from "@/lib/apis/pdf/client";

interface SelectedFile {
  file: File;
  preview: string;
}

interface InspireStore {
  prompt: string;
  setPrompt: (prompt: string) => void;
  selectedFiles: SelectedFile[];
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  isLoading: boolean;
  loadingText: string;
  generate: (
    router: any,
    loadDynamicProject: (
      projectName: string,
      tag: any,
      newComponents: any[],
      newAlerts?: any[],
      newSpecs?: any,
      newPdfReport?: Blob | null
    ) => void
  ) => Promise<void>;
  setLoadingState: (loading: boolean, text?: string) => void;
}

const Ctx = createContext<InspireStore | null>(null);

export function InspireProvider({ children }: { children: ReactNode }) {
  const [prompt, setPromptState] = useState("");
  const [selectedFiles, setSelectedFilesState] = useState<SelectedFile[]>([]);
  const [isLoading, setIsLoadingState] = useState(false);
  const [loadingText, setLoadingTextState] = useState("Generating...");

  const addFile = useCallback((file: File) => {
    const preview = URL.createObjectURL(file);
    setSelectedFilesState((prev) => [...prev, { file, preview }]);
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFilesState((prev) => {
      const updated = [...prev];
      if (updated[index]) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  const setLoadingState = useCallback((loading: boolean, text?: string) => {
    setIsLoadingState(loading);
    if (text) setLoadingTextState(text);
  }, []);

  const generate = useCallback(
    async (router: any, loadDynamicProject: any) => {
      if (prompt.trim() === "" && selectedFiles.length === 0) {
        throw new Error("Prompt and files are empty");
      }

      setIsLoadingState(true);
      try {
        const imageFile = selectedFiles.length > 0 ? selectedFiles[0].file : null;
        const sanitizedPrompt = prompt ? prompt.replace(/[^\x00-\x7F]/g, "") : null;

        setLoadingTextState("Calculating specs...");
        const specsData = await generateSpecs(sanitizedPrompt, imageFile);
        const specsContext = JSON.stringify(specsData);

        const pdfBytes = await downloadReport({
          projectName: sanitizedPrompt || "Extracted Schematic",
          items: specsData.specs,
        }, true) as ArrayBuffer;

        setLoadingTextState("Generating BOM...");
        const combinedPrompt = sanitizedPrompt
          ? `${sanitizedPrompt}\n\nRELEVANT SPECS ANALYSIS:\n${specsContext}`
          : `Generate a BOM based on the following specs analysis:\n${specsContext}`;

        const data = await generateBOM(combinedPrompt, imageFile);

        const projectName = sanitizedPrompt ? sanitizedPrompt : "Extracted Schematic";
        loadDynamicProject(
          projectName,
          data.tag || "N/A",
          data.items,
          data.alerts,
          specsData,
          new Blob([pdfBytes], { type: "application/pdf" }),
        );

        router.push(
          `/bom?generate=dynamic&prompt=${encodeURIComponent(projectName)}`,
        );
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        setIsLoadingState(false);
        setLoadingTextState("Generating...");
      }
    },
    [prompt, selectedFiles]
  );

  const value = useMemo<InspireStore>(() => ({
    prompt,
    setPrompt: setPromptState,
    selectedFiles,
    addFile,
    removeFile,
    isLoading,
    loadingText,
    setLoadingState,
    generate,
  }), [prompt, selectedFiles, isLoading, loadingText, addFile, removeFile, setLoadingState, generate]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInspire() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useInspire outside provider");
  return v;
}
