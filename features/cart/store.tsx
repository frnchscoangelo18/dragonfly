"use client";
import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface CartStore {
  isListModalOpen: boolean;
  setIsListModalOpen: (open: boolean) => void;
}

const Ctx = createContext<CartStore | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [isListModalOpen, setIsListModalOpen] = useState(false);

  const value = useMemo<CartStore>(() => ({
    isListModalOpen,
    setIsListModalOpen,
  }), [isListModalOpen]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart outside provider");
  return v;
}
