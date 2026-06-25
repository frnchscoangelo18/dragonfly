"use client";
import { BomProvider } from "@/features/bom/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <BomProvider>{children}</BomProvider>;
}
