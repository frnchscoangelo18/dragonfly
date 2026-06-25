import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { initialBOM, type Component } from "./data";

interface BomStore {
  items: Component[];
  total: number;
  itemCount: number;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  swap: (id: string, next: Omit<Component, "qty">) => void;
}

const Ctx = createContext<BomStore | null>(null);

export function BomProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Component[]>(initialBOM);

  const value = useMemo<BomStore>(() => {
    const total = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const itemCount = items.reduce((s, i) => s + i.qty, 0);
    return {
      items,
      total,
      itemCount,
      setQty: (id, qty) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...i, qty: Math.max(0, qty) } : i)),
        ),
      remove: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      swap: (id, next) =>
        setItems((prev) =>
          prev.map((i) => (i.id === id ? { ...next, qty: i.qty } : i)),
        ),
    };
  }, [items]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useBom() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useBom outside provider");
  return v;
}