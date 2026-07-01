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
import {
  ProjectModel,
  ProjectNodeModel,
  ProjectEdgeModel,
  ProjectComponentModel,
  ProjectNode,
  ProjectEdge,
} from "@/lib/apis/project/types";
import { ItemModel } from "@/lib/apis/inventory/types";
import { GeneratedFlow } from "@/lib/apis/generate/types";

interface FlowStore {
  currentProject: ProjectModel | null;
  setCurrentProject: Dispatch<SetStateAction<ProjectModel | null>>;
  currentNodes: ProjectNodeModel[];
  setCurrentNodes: Dispatch<SetStateAction<ProjectNodeModel[]>>;
  currentEdges: ProjectEdgeModel[];
  setCurrentEdges: Dispatch<SetStateAction<ProjectEdgeModel[]>>;
  projectComponents: ProjectComponentModel[];
  setProjectComponents: Dispatch<SetStateAction<ProjectComponentModel[]>>;
  inventory: ItemModel[];
  setInventory: Dispatch<SetStateAction<ItemModel[]>>;
  projects: ProjectModel[];
  setProjects: Dispatch<SetStateAction<ProjectModel[]>>;
  loadDynamicFlow: (flowData: GeneratedFlow) => void;
}

const Ctx = createContext<FlowStore | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<ProjectModel | null>(
    null,
  );
  const [currentNodes, setCurrentNodes] = useState<ProjectNodeModel[]>([]);
  const [currentEdges, setCurrentEdges] = useState<ProjectEdgeModel[]>([]);
  const [projectComponents, setProjectComponents] = useState<
    ProjectComponentModel[]
  >([]);
  const [inventory, setInventory] = useState<ItemModel[]>([]);
  const [projects, setProjects] = useState<ProjectModel[]>([]);

  const loadDynamicFlow = useCallback(
    (
      flowData: GeneratedFlow,
      overrideProject?: ProjectModel,
      overrideNodes?: ProjectNodeModel[],
      overrideEdges?: ProjectEdgeModel[],
    ) => {
      const project = overrideProject || {
        id: `proj-gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: flowData.name,
        time: new Date().toISOString(),
        tag: flowData.tag || "N/A",
      };

      setProjects((prev) => {
        if (prev.find((p) => p.id === project.id)) return prev;
        return [...prev, project];
      });
      setCurrentProject(project);

      if (overrideNodes) {
        setCurrentNodes(overrideNodes);
      } else {
        setCurrentNodes(
          flowData.nodes.map((n: ProjectNode, i: number) => ({
            id: `node-gen-${Date.now()}-${i}`,
            projectId: project.id,
            componentId: `comp-gen-${i}`,
            positionX: n.positionX,
            positionY: n.positionY,
          })),
        );
      }

      if (overrideEdges) {
        setCurrentEdges(overrideEdges);
      } else {
        setCurrentEdges(
          flowData.edges.map((e: ProjectEdge, i: number) => ({
            id: `edge-gen-${Date.now()}-${i}`,
            projectId: project.id,
            sourceId: e.sourceId,
            targetId: e.targetId,
            label: e.label,
            type: e.type,
            sourceHandle: e.sourceHandle || "bottom",
            targetHandle: e.targetHandle || "top",
          })),
        );
      }
    },
    [],
  );

  const value = useMemo<FlowStore>(
    () => ({
      currentProject,
      setCurrentProject,
      currentNodes,
      setCurrentNodes,
      currentEdges,
      setCurrentEdges,
      projectComponents,
      setProjectComponents,
      inventory,
      setInventory,
      projects,
      setProjects,
      loadDynamicFlow,
    }),
    [
      currentProject,
      currentNodes,
      currentEdges,
      projectComponents,
      inventory,
      projects,
      loadDynamicFlow,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFlow() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFlow outside provider");
  return v;
}
