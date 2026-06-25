"use client";

import Link from "next/link"; // 1. Correct Next.js Link import
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, ListChecks, GitBranch, ShoppingBag } from "lucide-react"; // 2. Removed Link from here

// 3. Changed 'to' to 'href' for Next.js consistency
const tabs = [
  { href: "/", label: "Build", icon: Sparkles },
  { href: "/bom", label: "BOM", icon: ListChecks },
  { href: "/flow", label: "Flow", icon: GitBranch },
  { href: "/cart", label: "Cart", icon: ShoppingBag },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-[440px] justify-center px-5 pb-5">
      <div className="glass-strong pointer-events-auto flex w-full items-center justify-around rounded-full border border-white/5 px-3 py-2 glow-soft">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 py-2"
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-primary/15 ring-1 ring-primary/40"
                />
              )}
              <Icon
                size={20}
                className={`relative z-10 transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              />
              <span
                className={`relative z-10 text-[10px] font-medium tracking-wide transition-colors ${
                  active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
