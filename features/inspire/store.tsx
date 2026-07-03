"use client";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { generateSpecs } from "@/lib/apis/generate/specsClient";
import { generateBOM } from "@/lib/apis/generate/bomClient";
import { generateVisualFlow } from "@/lib/apis/generate/visualFlowClient";
import { withRetry } from "@/lib/apis/generate/utils";
import { downloadReport } from "@/lib/apis/pdf/client";
import {
  GeneratedSpecs,
  GeneratedFlow,
  GeneratedBOM,
} from "@/lib/apis/generate/types";
import {
  ProjectComponentModel,
  ProjectEdgeModel,
  ProjectModel,
  ProjectNodeModel,
  ProjectTagEnum,
} from "@/lib/apis/project/types";
import { BomAlert } from "@/features/bom/data";
import { syncGeneratedData } from "@/lib/apis/project/syncClient";
import { getMockData } from "./mockData";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const USE_MOCK_DATA = true; // Toggle here

interface SelectedFile {
  file: File;
  preview: string;
}

interface InspireStore {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  selectedFiles: SelectedFile[];
  addFile: (file: File) => void;
  removeFile: (index: number) => void;
  isLoading: boolean;
  loadingText: string;
  generate: (
    router: AppRouterInstance,
    loadDynamicProject: (
      projectName: string,
      tag: ProjectTagEnum,
      newComponents: ProjectComponentModel[],
      newAlerts?: BomAlert[],
      newSpecs?: GeneratedSpecs,
      newPdfReport?: Blob | null,
    ) => void,
    loadDynamicFlow: (
      flowData: GeneratedFlow,
      project?: ProjectModel,
      nodes?: ProjectNodeModel[],
      edges?: ProjectEdgeModel[],
    ) => void,
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
    async (
      router: AppRouterInstance,
      loadDynamicProject: (
        projectName: string,
        tag: ProjectTagEnum,
        newComponents: ProjectComponentModel[],
        newAlerts?: BomAlert[],
        newSpecs?: GeneratedSpecs,
        newPdfReport?: Blob | null,
      ) => void,
      loadDynamicFlow: (
        flowData: GeneratedFlow,
        project?: ProjectModel,
        nodes?: ProjectNodeModel[],
        edges?: ProjectEdgeModel[],
      ) => void,
    ) => {
      if (prompt.trim() === "" && selectedFiles.length === 0) {
        throw new Error("Prompt and files are empty");
      }

      setIsLoadingState(true);
      try {
        const imageFile =
          selectedFiles.length > 0 ? selectedFiles[0].file : null;
        const sanitizedPrompt = prompt
          ? prompt.replace(/[^\x00-\x7F]/g, "")
          : null;

        // projectId
        const timestamp = new Date().toISOString();
        const projectId = `project-${timestamp}`;

        // 1. Specs
        setLoadingTextState("Calculating specs...");
        let specsData: GeneratedSpecs;
        let bomResult: GeneratedBOM;
        let flowResult: GeneratedFlow;

        if (USE_MOCK_DATA) {
          console.log("Using Mock Data");
          const mock = getMockData(projectId);
          specsData = mock.specsData;
          bomResult = mock.bomResult;
          flowResult = mock.flowResult;
        } else {
          const specsRaw = await withRetry(async () => {
            return await generateSpecs(sanitizedPrompt, imageFile);
          });
          specsData = specsRaw;
          const specsContext = JSON.stringify(specsData);
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 2. BOM
          setLoadingTextState("Generating BOM...");
          bomResult = await withRetry(async () => {
            return await generateBOM(specsContext, imageFile, projectId);
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // 3. Flow
          setLoadingTextState("Generating visual flow...");
          flowResult = await withRetry(async () => {
            return await generateVisualFlow(
              JSON.stringify(bomResult),
              sanitizedPrompt,
              imageFile,
              projectId,
            );
          });
        }

        const projectName = flowResult.name || "Generated Project";

        setLoadingTextState("Generating report...");
        const pdfBytes = (await downloadReport(
          {
            projectName,
            items: specsData.specs,
          },
          true,
        )) as ArrayBuffer;

        // Sync to DB
        const syncResult = await syncGeneratedData(
          projectName,
          specsData,
          bomResult,
          flowResult,
          pdfBytes,
        );

        loadDynamicProject(
          projectName,
          syncResult.projectTag,
          syncResult.projectComponents,
          bomResult.alerts,
          specsData,
          new Blob([pdfBytes], { type: "application/pdf" }),
        );

        loadDynamicFlow(
          flowResult,
          syncResult.project,
          syncResult.nodes,
          syncResult.edges,
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
    [prompt, selectedFiles],
  );

  const value = useMemo<InspireStore>(
    () => ({
      prompt,
      setPrompt: setPromptState,
      selectedFiles,
      addFile,
      removeFile,
      isLoading,
      loadingText,
      setLoadingState,
      generate,
    }),
    [
      prompt,
      selectedFiles,
      isLoading,
      loadingText,
      addFile,
      removeFile,
      setLoadingState,
      generate,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useInspire() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useInspire outside provider");
  return v;
}
