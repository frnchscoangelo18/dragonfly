import type { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { UserMenu } from "@/components/UserMenu";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-[440px] flex-col overflow-hidden bg-background">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-72 bg-[radial-gradient(ellipse_at_center,var(--glow),transparent_70%)] opacity-30" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--color-accent),transparent_70%)] opacity-10" />
      <div className="absolute top-4 right-4 z-50">
        <UserMenu />
      </div>
      <main className="relative z-10 flex-1">{children}</main>
      <BottomNav />
    </div>
  );
}

