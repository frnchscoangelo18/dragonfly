"use client";
import {
  createContext,
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
} from "@/lib/apis/project/types";
import { ItemModel } from "@/lib/apis/inventory/types";

interface FlowStore {
  currentProject: ProjectModel | null;
  setCurrentProject: (project: ProjectModel | null) => void;
  currentNodes: ProjectNodeModel[];
  setCurrentNodes: (nodes: ProjectNodeModel[]) => void;
  currentEdges: ProjectEdgeModel[];
  setCurrentEdges: (edges: ProjectEdgeModel[]) => void;
  inventory: ItemModel[];
  setInventory: (inventory: ItemModel[]) => void;
  projects: ProjectModel[];
  setProjects: (projects: ProjectModel[]) => void;
  loadDynamicFlow: (flowData: any) => void;
}

const Ctx = createContext<FlowStore | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<ProjectModel | null>(null);
  const [currentNodes, setCurrentNodes] = useState<ProjectNodeModel[]>([]);
  const [currentEdges, setCurrentEdges] = useState<ProjectEdgeModel[]>([]);
  const [inventory, setInventory] = useState<ItemModel[]>([]);
  const [projects, setProjects] = useState<ProjectModel[]>([]);

  const loadDynamicFlow = useCallback((flowData: any) => {
    const project = {
      id: `proj-gen-${Date.now()}`,
      name: flowData.name,
      time: new Date().toISOString(),
      tag: flowData.tag,
    };

    setProjects((prev) => [...prev, project]);
    setCurrentProject(project);

    // Nodes and edges would typically be loaded from a database via projectId.
    // For dynamic generation, we'll store them in the state for the current view.
    setCurrentNodes(
      flowData.nodes.map((n: any, i: number) => ({
        ...n,
        projectId: project.id,
        componentId: `comp-${i}`,
      }))
    );
    setCurrentEdges(
      flowData.edges.map((e: any) => ({
        ...e,
        projectId: project.id,
      }))
    );
  }, []);

  const value = useMemo<FlowStore>(() => ({
    currentProject,
    setCurrentProject,
    currentNodes,
    setCurrentNodes,
    currentEdges,
    setCurrentEdges,
    inventory,
    setInventory,
    projects,
    setProjects,
    loadDynamicFlow,
  }), [currentProject, currentNodes, currentEdges, inventory, projects, loadDynamicFlow]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFlow() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFlow outside provider");
  return v;
}
