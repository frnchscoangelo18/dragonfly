"use client";
import { Suspense } from "react";
import { BomProvider } from "@/features/bom/store";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <BomProvider>
      <Suspense fallback={null}>{children}</Suspense>
    </BomProvider>
  );
}
