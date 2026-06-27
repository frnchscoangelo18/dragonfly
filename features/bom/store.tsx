"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { type Component } from "./data";
import { type ProjectTag, recentProjects } from "@/data/mock/projects";
import { mockInventory } from "@/data/mock/inventory";
import {
  type ProjectCartSummary,
  calculateProjectCartSummary,
} from "@/lib/project-calculator";

interface BomStore {
  items: Component[];
  total: number;
  itemCount: number;
  projectInfo: { name: string; tag: ProjectTag } | null;
  pushedHistory: ProjectCartSummary[];
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  swap: (id: string, next: Omit<Component, "qty">) => void;
  loadProject: (projectName: string) => void;
  pushToCart: (summary: Omit<ProjectCartSummary, 'totalPrice'>) => void;
  moveToLastCart: (index: number) => void;
}

const Ctx = createContext<BomStore | null>(null);

export function BomProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Component[]>([]);
  const [projectInfo, setProjectInfo] = useState<{
    name: string;
    tag: ProjectTag;
  } | null>(null);
  const [pushedHistory, setPushedHistory] = useState<ProjectCartSummary[]>([]);

  const loadProject = (projectName: string) => {
    const project = recentProjects.find((p) => p.name === projectName);
    if (!project) return;

    setProjectInfo({ name: project.name, tag: project.tag });

    const components = project.nodes
      .map((node) => node.id)
      .map((id) => mockInventory.find((item) => item.id === id))
      .filter((item): item is Component => !!item);

    setItems(components);
  };
  const pushToCart = useCallback(
    (summary: Omit<ProjectCartSummary, 'totalPrice'>) => {
      const totalPrice = summary.items.reduce((s, i) => s + i.qtyPrice, 0);
      const fullSummary: ProjectCartSummary = { ...summary, totalPrice };
      setPushedHistory((prev) => [...prev, fullSummary]);
    },
    [],
  );
  const moveToLastCart = useCallback(
    (index: number) =>
      setPushedHistory((prev) => {
        if (index < 0 || index >= prev.length) return prev;
        const item = prev[index];
        const newHistory = prev.filter((_, i) => i !== index);
        return [...newHistory, item];
      }),
    [],
  );

  const value = useMemo<BomStore>(() => {
    const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const itemCount = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      total,
      itemCount,
      projectInfo,
      pushedHistory,
      setQty: (id, qty) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i)),
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      swap: (id, next) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...next, qty: i.qty } : i)),
        ),
      loadProject,
      pushToCart,
      moveToLastCart,
    };
  }, [items, projectInfo, pushedHistory, pushToCart, moveToLastCart]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBom() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBom outside provider");
  return v;
}
