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
}

const Ctx = createContext<FlowStore | null>(null);

export function FlowProvider({ children }: { children: ReactNode }) {
  const [currentProject, setCurrentProject] = useState<ProjectModel | null>(null);
  const [currentNodes, setCurrentNodes] = useState<ProjectNodeModel[]>([]);
  const [currentEdges, setCurrentEdges] = useState<ProjectEdgeModel[]>([]);
  const [inventory, setInventory] = useState<ItemModel[]>([]);
  const [projects, setProjects] = useState<ProjectModel[]>([]);

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
  }), [currentProject, currentNodes, currentEdges, inventory, projects]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFlow() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useFlow outside provider");
  return v;
}
